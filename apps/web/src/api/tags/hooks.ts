import { useMutation, useQuery, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type {
  AssignTagsRequest,
  CreateTagRequest,
  CreateTagResponse,
  GetAllTagsQuery,
  UnassignTagsRequest,
  UpdateTagRequest,
  UpdateTagResponse,
} from '@tradelink/shared';
import type { ApiError } from '@tradelink/shared/common';
import { useTenantParam } from 'hooks/use-tenant-param';
import { tagApi } from './api';

export function useGetAllTags(query?: GetAllTagsQuery) {
  const tenantId = useTenantParam();

  return useQuery({
    queryKey: ['tags', query],
    queryFn: () => tagApi(tenantId).getAllTags(query),
  });
}

export function useGetTag(id: number | string) {
  const tenantId = useTenantParam();

  return useQuery({
    queryKey: ['tags', id],
    queryFn: () => tagApi(tenantId).getTag(id),
    enabled: !!id,
  });
}

export function useCreateTag(options?: UseMutationOptions<CreateTagResponse, ApiError, CreateTagRequest>) {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagRequest) => tagApi(tenantId).createTag(data),
    ...options,
    onSuccess: (...args) => {
      options?.onSuccess?.(...args);
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useUpdateTag(options?: UseMutationOptions<UpdateTagResponse, ApiError, UpdateTagRequest>) {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: number | string } & UpdateTagRequest) => tagApi(tenantId).updateTag(id, data),
    ...options,
    onSuccess: (...args) => {
      options?.onSuccess?.(...args);
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useDeleteTag() {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => tagApi(tenantId).deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useAssignTagsToCompany() {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, data }: { companyId: number | string; data: AssignTagsRequest }) =>
      tagApi(tenantId).assignTagsToCompany(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['company'] });
    },
  });
}

export function useUnassignTagsFromCompany() {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, data }: { companyId: number | string; data: UnassignTagsRequest }) =>
      tagApi(tenantId).unassignTagsFromCompany(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['company'] });
    },
  });
}

export function useAssignTagsToContact() {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactId, data }: { contactId: number | string; data: AssignTagsRequest }) =>
      tagApi(tenantId).assignTagsToContact(contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact'] });
    },
  });
}

export function useUnassignTagsFromContact() {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactId, data }: { contactId: number | string; data: UnassignTagsRequest }) =>
      tagApi(tenantId).unassignTagsFromContact(contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact'] });
    },
  });
}
