import { jwtDecode } from 'jwt-decode';
import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../context/auth-context';
import { authStorage } from '../lib/auth-utils';

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export function useTokenRefresh() {
  const { refreshToken } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleRefresh = useCallback(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const token = authStorage.getToken();
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now();
      const expirationTime = (decoded.exp || 0) * 1000; // Convert to milliseconds
      const timeUntilExpiry = expirationTime - currentTime;
      const timeUntilRefresh = timeUntilExpiry - TOKEN_REFRESH_THRESHOLD;

      if (timeUntilRefresh > 0) {
        // Schedule refresh before token expires
        timeoutRef.current = setTimeout(async () => {
          try {
            await refreshToken();
            // Reschedule for the new token
            scheduleRefresh();
          } catch (error) {
            console.error('Failed to refresh token:', error);
          }
        }, timeUntilRefresh);
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }, [refreshToken]);

  useEffect(() => {
    scheduleRefresh();

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [scheduleRefresh]);

  // Re-schedule when token changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tanstack.auth.token' && e.newValue) {
        scheduleRefresh();
      }
    };

    globalThis.addEventListener('storage', handleStorageChange);
    return () => {
      globalThis.removeEventListener('storage', handleStorageChange);
    };
  }, [scheduleRefresh]);

  return { scheduleRefresh };
}
