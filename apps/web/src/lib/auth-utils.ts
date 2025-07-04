import type { AuthenticatedUser } from '@tradelink/shared/auth';

export const AUTH_STORAGE_KEYS = {
  TOKEN: 'tanstack.auth.token',
  USER: 'tanstack.auth.user',
} as const;

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  },

  setToken(token: string): void {
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
  },

  removeToken(): void {
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
  },

  getUser(): AuthenticatedUser | undefined {
    const userData = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    if (!userData) return;

    try {
      return JSON.parse(userData);
    } catch {
      return;
    }
  },

  setUser(user: AuthenticatedUser): void {
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
  },

  removeUser(): void {
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  },

  clearAll(): void {
    this.removeToken();
    this.removeUser();
  },

  hasValidSession(): boolean {
    return !!(this.getToken() && this.getUser());
  },
};
