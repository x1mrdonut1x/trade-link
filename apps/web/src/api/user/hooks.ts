import { useMutation, useQuery } from '@tanstack/react-query';
import type { CreateUserRequest, UpdateUserRequest } from 'shared/user';
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from './api';

const userKey = 'users';

export function useGetAllUsers() {
  return useQuery({
    queryKey: [userKey],
    queryFn: () => getAllUsers(),
  });
}

export function useGetUser(id: number) {
  return useQuery({
    queryKey: [userKey, id],
    queryFn: () => getUser(id),
  });
}

export function useCreateUser() {
  return useMutation({
    mutationKey: [userKey],
    mutationFn: (data: CreateUserRequest) => createUser(data),
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationKey: [userKey],
    mutationFn: ({ id, ...data }: UpdateUserRequest & { id: number }) => updateUser(id, data),
  });
}

export function useDeleteUser() {
  return useMutation({
    mutationKey: [userKey],
    mutationFn: (id: number) => deleteUser(id),
  });
}
