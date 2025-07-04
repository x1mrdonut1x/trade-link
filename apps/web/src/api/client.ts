import queryString from 'query-string';
import { AUTH_STORAGE_KEYS, authStorage } from '../lib/auth-utils';

export class ApiError extends Error {
  public status: number;
  public data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized', data?: unknown) {
    super(message, 401, data);
    this.name = 'UnauthorizedError';
  }
}

export async function myFetch<T = unknown>(
  url: string,
  data?: Omit<globalThis.RequestInit, 'body'> & { body?: unknown; query?: Record<string, unknown> }
): Promise<T> {
  const headers = new Headers(data?.headers);

  // Get token from localStorage
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  headers.append('Content-Type', 'application/json');

  const baseUrl = import.meta.env.VITE_API_URL;

  const parsedUrl = new URL(`${baseUrl}/${url}`);

  parsedUrl.search = new URLSearchParams(
    queryString.stringify(data?.query || {}, { skipEmptyString: true, skipNull: true })
  ).toString();

  const parsedBody = JSON.stringify(data?.body);

  if (data?.method !== 'GET') {
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  const response = await fetch(parsedUrl, { ...data, headers, body: parsedBody });

  if (!response.ok) {
    let errorData: ApiError | null = null;

    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }

    if (response.status === 401) {
      authStorage.clearAll();
      throw new UnauthorizedError(errorData?.message);
    }

    const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
    throw new ApiError(errorMessage, response.status, errorData);
  }

  return response.json() as T;
}
