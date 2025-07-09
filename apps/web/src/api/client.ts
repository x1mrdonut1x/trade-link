import { getAuthCallbacks } from 'context/auth-context';
import queryString from 'query-string';
import { AUTH_STORAGE_KEYS, authStorage } from '../lib/auth-utils';
import { ApiError, refreshToken, UnauthorizedError } from './client.util';

// Track if we're currently refreshing to avoid multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });

  failedQueue = [];
};

export async function myFetch<T = unknown>(
  tenantId: string | number | undefined,
  url: string,
  data?: Omit<globalThis.RequestInit, 'body'> & { body?: unknown; query?: Record<string, unknown> }
): Promise<T> {
  // Function to make the actual request
  const makeRequest = async (accessToken?: string): Promise<T> => {
    const headers = new Headers(data?.headers);

    // Use provided token or get from localStorage
    const token = accessToken || localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);

    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
      if (tenantId) headers.append('tenant-id', tenantId.toString());
    }

    let parsedBody = data?.body as any;
    if (!(parsedBody instanceof FormData)) {
      headers.append('content-type', 'application/json');
      parsedBody = JSON.stringify(data?.body);
    }

    const baseUrl = import.meta.env.VITE_API_URL;
    const parsedUrl = new URL(`${baseUrl}/${url}`);

    parsedUrl.search = new URLSearchParams(
      queryString.stringify(data?.query || {}, {
        skipEmptyString: true,
        skipNull: true,
        arrayFormat: 'comma',
      })
    ).toString();
    const response = await fetch(parsedUrl, { ...data, headers, body: parsedBody });

    if (!response.ok) {
      let errorData: ApiError | null = null;

      try {
        errorData = await response.json();
      } catch {
        errorData = null;
      }

      if (response.status === 401) {
        const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
        throw new UnauthorizedError(errorMessage, errorData);
      }

      // const errorTitle = errorData?.title || `HTTP error! status: ${response.status}`;
      const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
      throw new ApiError(errorMessage, response.status, errorData);
    }

    return response.json() as T;
  };

  try {
    // Try the initial request
    return await makeRequest();
  } catch (error) {
    // If it's a 401 error and not a refresh/login request, try to refresh the token
    if (
      error instanceof UnauthorizedError &&
      !url.includes('auth/refresh') &&
      !url.includes('auth/login') &&
      authStorage.getRefreshToken()
    ) {
      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve: (token: string) => resolve(makeRequest(token)), reject });
        });
      }

      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const newAccessToken = await refreshToken();
        processQueue(null, newAccessToken);

        // Retry the original request with the new token
        return await makeRequest(newAccessToken);
      } catch (refreshError) {
        // Refresh failed, clear auth and logout
        processQueue(refreshError, null);
        authStorage.clearAll();
        for (const callback of getAuthCallbacks()) callback();
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    // If it's not a 401 or refresh failed, just throw the original error
    throw error;
  }
}
