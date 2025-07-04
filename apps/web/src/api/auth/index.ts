import { queryOptions } from '@tanstack/react-query';
import type { AuthenticatedUser } from '@tradelink/shared/auth';
import { authStorage } from '../../lib/auth-utils';
import { myFetch, UnauthorizedError } from '../client';

export function authQueryOptions() {
  return queryOptions({
    queryKey: ['auth'],
    queryFn: async (): Promise<AuthenticatedUser | undefined> => {
      const token = authStorage.getToken();
      if (!token) return undefined;

      try {
        return await myFetch<AuthenticatedUser>('auth/profile');
      } catch (error) {
        // If profile fetch fails, clear token and return undefined
        authStorage.clearAll();

        // Re-throw UnauthorizedError to be handled by auth context
        if (error instanceof UnauthorizedError) {
          throw error;
        }

        return undefined;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (error instanceof UnauthorizedError) {
        return false;
      }
      return failureCount < 3;
    },
  });
}
