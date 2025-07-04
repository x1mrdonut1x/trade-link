import { myFetch } from '../client';

import type { LoginRequest, LoginResponse, RegisterRequest } from '@tradelink/shared';

export const authApi = {
  login: (body: LoginRequest) => {
    return myFetch<LoginResponse>('auth/login', { body, method: 'POST' });
  },

  register: (body: RegisterRequest) => {
    return myFetch<LoginResponse>('auth/register', { body, method: 'POST' });
  },
};
