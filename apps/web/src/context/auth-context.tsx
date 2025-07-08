import type { LoginResponse } from '@tradelink/shared';
import type { JWTToken, LoginRequest, RegisterRequest } from '@tradelink/shared/auth';
import { authApi } from 'api/auth/api';
import { jwtDecode } from 'jwt-decode';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { authStorage } from '../lib/auth-utils';

export interface IAuthContext {
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  user?: JWTToken;
}

let authCallbacks: (() => void)[] | undefined;

export const getAuthCallbacks = () => {
  if (!authCallbacks) {
    authCallbacks = [];
  }
  return authCallbacks;
};

const decodeToken = (token?: string | null) => {
  if (!token) return;

  try {
    return jwtDecode<JWTToken>(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return undefined;
  }
};

const AuthContext = createContext<IAuthContext>({} as any);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<JWTToken | undefined>(() => decodeToken(authStorage.getToken()));
  const [isAuthenticated, setIsAuthenticated] = useState(() => decodeToken(authStorage.getToken())?.id != null);

  useLayoutEffect(() => {
    setIsAuthenticated(user?.id != null);

    // On logout
    getAuthCallbacks().push(() => {
      console.log('on logout callback');
      setIsAuthenticated(false);
      setUser(undefined);
    });
  }, [user]);

  const saveToken = (response: LoginResponse) => {
    authStorage.setToken(response.access_token);
    authStorage.setRefreshToken(response.refresh_token);

    setUser(jwtDecode(response.access_token));
  };

  const logout = useCallback(async () => {
    try {
      // Call the logout API to invalidate refresh token on server
      await authApi.logout();
    } catch (error) {
      // Even if logout API fails, clear local storage
      console.warn('Logout API call failed:', error);
    } finally {
      authStorage.clearAll();
      setUser(undefined);
    }
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);
    saveToken(response);
  }, []);

  const register = useCallback(async (credentials: RegisterRequest) => {
    const response = await authApi.register(credentials);
    saveToken(response);
  }, []);

  const refreshToken = useCallback(async () => {
    const storedRefreshToken = authStorage.getRefreshToken();
    if (!storedRefreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await authApi.refresh({ refresh_token: storedRefreshToken });
    saveToken(response);
  }, []);

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    const scheduleRefresh = () => {
      const token = authStorage.getToken();
      if (!token) return () => {};

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now();
        const expirationTime = (decoded.exp || 0) * 1000;
        const timeUntilExpiry = expirationTime - currentTime;
        const timeUntilRefresh = timeUntilExpiry - 5 * 60 * 1000; // 5 minutes before expiry

        if (timeUntilRefresh > 0) {
          const timeoutId = setTimeout(async () => {
            try {
              await refreshToken();
            } catch (error) {
              // If auto-refresh fails, user will need to login again
              authStorage.clearAll();
              setUser(undefined);
            }
          }, timeUntilRefresh);

          return () => clearTimeout(timeoutId);
        }
      } catch (error) {
        console.error('Failed to decode token for auto-refresh:', error);
      }

      return () => {};
    };

    return scheduleRefresh();
  }, [user, refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
