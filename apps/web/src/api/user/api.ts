import type { CreateUserRequest, GetUserResponse, UpdateUserRequest } from 'shared/user';
import { myFetch } from '../client';

export function getAllUsers() {
  return myFetch<GetUserResponse[]>('/users');
}

export function getUser(id: number) {
  return myFetch<GetUserResponse>(`/users/${id}`);
}

export function createUser(body: CreateUserRequest) {
  return myFetch<GetUserResponse>('/users', { method: 'POST', body });
}

export function updateUser(id: number, body: UpdateUserRequest) {
  return myFetch<GetUserResponse>(`/users/${id}`, { method: 'PUT', body });
}

export function deleteUser(id: number) {
  return myFetch(`/users/${id}`, { method: 'DELETE' });
}
