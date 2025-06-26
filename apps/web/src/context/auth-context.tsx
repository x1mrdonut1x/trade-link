import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react';

export interface IAuthContext {
  isAuthenticated: boolean;
  login: (username: string) => Promise<void>;
  logout: () => Promise<void>;
  user: string | null;
}

const AuthContext = createContext<IAuthContext | null>(null);

const storedUserKey = 'tanstack.auth.user';

function getStoredUser() {
  return localStorage.getItem(storedUserKey);
}

function setStoredUser(user: string | null) {
  if (user) {
    localStorage.setItem(storedUserKey, user);
  } else {
    localStorage.removeItem(storedUserKey);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(getStoredUser());
  const isAuthenticated = !!user;

  const logout = useCallback(async () => {
    setStoredUser(null);
    setUser(null);
  }, []);

  const login = useCallback(async (username: string) => {
    setStoredUser(username);
    setUser(username);
  }, []);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
