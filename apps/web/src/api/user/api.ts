import { myFetch } from '../client';

import type { CreateUserRequest, GetUserResponse, UpdateUserRequest } from '@tradelink/shared/user';

export function getAllUsers(tenantId: string) {
  return myFetch<GetUserResponse[]>(tenantId, '/users');
}

export function getUser(tenantId: string, id: number) {
  return myFetch<GetUserResponse>(tenantId, `/users/${id}`);
}

export function createUser(tenantId: string, body: CreateUserRequest) {
  return myFetch<GetUserResponse>(tenantId, '/users', { method: 'POST', body });
}

export function updateUser(tenantId: string, id: number, body: UpdateUserRequest) {
  return myFetch<GetUserResponse>(tenantId, `/users/${id}`, { method: 'PUT', body });
}

export function deleteUser(tenantId: string, id: number) {
  return myFetch(tenantId, `/users/${id}`, { method: 'DELETE' });
}
