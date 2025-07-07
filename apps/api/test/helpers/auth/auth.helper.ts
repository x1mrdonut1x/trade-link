import { LoginResponse, type AuthenticatedUser } from '@tradelink/shared';
import { requestWithToken } from '../request.helper';

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
  return requestWithToken('').post<LoginResponse>('/auth/register', userData);
};

export const loginUser = async (email: string, password: string) => {
  return requestWithToken('').post<LoginResponse>('/auth/login', { email, password });
};

export const getProfile = async (token: string) => {
  return requestWithToken(token).get<AuthenticatedUser>('/auth/profile');
};

export const createAuthenticatedUser = async (userData = authFixtures.testUser) => {
  await registerUser(userData);
  const loginResponse = await loginUser(userData.email, userData.password);
  return loginResponse.access_token;
};
