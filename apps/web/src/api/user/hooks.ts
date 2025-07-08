import { useMutation, useQuery } from '@tanstack/react-query';

import { createUser, deleteUser, getAllUsers, getUser, updateUser } from './api';

import type { CreateUserRequest, UpdateUserRequest } from '@tradelink/shared/user';
import { useTenantParam } from 'hooks/use-tenant-param';

const userKey = 'users';

export function useGetAllUsers() {
  const tenantId = useTenantParam();

  return useQuery({
    queryKey: [userKey],
    queryFn: () => getAllUsers(tenantId),
  });
}

export function useGetUser(id: number) {
  const tenantId = useTenantParam();

  return useQuery({
    queryKey: [userKey, id],
    queryFn: () => getUser(tenantId, id),
  });
}

export function useCreateUser() {
  const tenantId = useTenantParam();

  return useMutation({
    mutationKey: [userKey],
    mutationFn: (data: CreateUserRequest) => createUser(tenantId, data),
  });
}

export function useUpdateUser() {
  const tenantId = useTenantParam();

  return useMutation({
    mutationKey: [userKey],
    mutationFn: ({ id, ...data }: UpdateUserRequest & { id: number }) => updateUser(tenantId, id, data),
  });
}

export function useDeleteUser() {
  const tenantId = useTenantParam();

  return useMutation({
    mutationKey: [userKey],
    mutationFn: (id: number) => deleteUser(tenantId, id),
  });
}
