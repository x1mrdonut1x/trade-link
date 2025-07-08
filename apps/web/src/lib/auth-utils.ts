export const AUTH_STORAGE_KEYS = {
  TOKEN: 'tanstack.auth.token',
  REFRESH_TOKEN: 'tanstack.auth.refresh_token',
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

  getRefreshToken(): string | null {
    return localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  },

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  },

  removeRefreshToken(): void {
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  },

  clearAll(): void {
    this.removeToken();
    this.removeRefreshToken();
  },

  hasValidSession(): boolean {
    return !!(this.getToken() && this.getRefreshToken());
  },
};
