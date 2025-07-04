import { useCallback, useState } from 'react';
import { authStorage } from '../lib/auth-utils';

export interface AuthState {
  isAuthenticated: boolean;
  error?: string;
}

export function useAuthState() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const hasValidSession = authStorage.hasValidSession();

    return {
      isAuthenticated: hasValidSession,
      error: undefined,
    };
  });

  const setAuthenticated = useCallback((isAuthenticated: boolean) => {
    setAuthState(prev => ({
      ...prev,
      isAuthenticated,
      error: undefined,
    }));
  }, []);

  const setError = useCallback((error?: string) => {
    setAuthState(prev => ({
      ...prev,
      error,
    }));
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({
      ...prev,
      error: undefined,
    }));
  }, []);

  return {
    authState,
    setAuthenticated,
    setError,
    clearError,
  };
}
