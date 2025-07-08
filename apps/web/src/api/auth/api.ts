import { myFetch } from '../client';

import type { LoginRequest, LoginResponse, RefreshTokenRequest, RegisterRequest } from '@tradelink/shared';

export const authApi = {
  login: (body: LoginRequest) => {
    return myFetch<LoginResponse>(undefined, 'auth/login', { body, method: 'POST' });
  },

  register: (body: RegisterRequest) => {
    return myFetch<LoginResponse>(undefined, 'auth/register', { body, method: 'POST' });
  },

  refresh: (body: RefreshTokenRequest) => {
    return myFetch<LoginResponse>(undefined, 'auth/refresh', { body, method: 'POST' });
  },

  logout: () => {
    return myFetch<{ message: string }>(undefined, 'auth/logout', { method: 'POST' });
  },
};
