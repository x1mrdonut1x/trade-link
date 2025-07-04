import type { AuthenticatedUser, LoginRequest, RegisterRequest } from '@tradelink/shared/auth';
import { authApi } from 'api/auth/api';
import { createContext, type ReactNode, useCallback, useContext, useState } from 'react';
import { useAuthState } from '../hooks/use-auth-state';
import { authStorage } from '../lib/auth-utils';

export interface IAuthContext {
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  user?: AuthenticatedUser;
}

const AuthContext = createContext<IAuthContext>({} as any);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | undefined>(authStorage.getUser() || undefined);

  const { authState, setAuthenticated } = useAuthState();

  const isAuthenticated = authState.isAuthenticated && !!user;

  const logout = useCallback(async () => {
    authStorage.clearAll();
    setUser(undefined);
    setAuthenticated(false);
  }, [setAuthenticated]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const response = await authApi.login(credentials);
      authStorage.setUser(response.user);
      authStorage.setToken(response.access_token);
      setUser(response.user);
      setAuthenticated(true);
    },
    [setAuthenticated]
  );

  const register = useCallback(
    async (credentials: RegisterRequest) => {
      const response = await authApi.register(credentials);
      authStorage.setUser(response.user);
      authStorage.setToken(response.access_token);
      setUser(response.user);
      setAuthenticated(true);
    },
    [setAuthenticated]
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
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
