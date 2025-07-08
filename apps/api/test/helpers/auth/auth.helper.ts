import { LoginResponse, type JWTToken } from '@tradelink/shared';
import { authRequest } from '../request.helper';

export interface AuthFixtures {
  testUser: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
  adminUser: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
}

export const authFixtures: AuthFixtures = {
  testUser: {
    email: 'test@example.com',
    password: 'Test123!Pass',
    firstName: 'Test',
    lastName: 'User',
  },
  adminUser: {
    email: 'admin@example.com',
    password: 'Admin123!Pass',
    firstName: 'Admin',
    lastName: 'User',
  },
};

export const registerUser = async (userData: typeof authFixtures.testUser) => {
  return authRequest('').post<LoginResponse>('/auth/register', userData);
};

export const loginUser = async (email: string, password: string) => {
  return authRequest('').post<LoginResponse>('/auth/login', { email, password });
};

export const getProfile = async (token: string) => {
  return authRequest(token).get<JWTToken>('/auth/profile');
};

export const createAuthenticatedUser = async (userData = authFixtures.testUser) => {
  await registerUser(userData);
  const loginResponse = await loginUser(userData.email, userData.password);
  return loginResponse.access_token;
};

export const refreshToken = async (refresh_token: string) => {
  return authRequest('').post<LoginResponse>('/auth/refresh', { refresh_token });
};

export const logoutUser = async (token: string) => {
  return authRequest(token).post('/auth/logout');
};
