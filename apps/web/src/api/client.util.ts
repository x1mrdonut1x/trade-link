import { authStorage } from '../lib/auth-utils';
import { authApi } from './auth/api';

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

export const refreshToken = async (): Promise<string> => {
  const refreshToken = authStorage.getRefreshToken();

  if (!refreshToken) {
    throw new UnauthorizedError('No refresh token available');
  }

  const data = await authApi.refresh({ refresh_token: refreshToken });

  // Update stored tokens
  authStorage.setToken(data.access_token);
  authStorage.setRefreshToken(data.refresh_token);

  return data.access_token;
};
