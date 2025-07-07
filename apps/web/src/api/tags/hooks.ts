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
import type { NormalizedErrorResponse } from '@tradelink/shared/common';
import { tagApi } from './api';

export function useGetAllTags(query?: GetAllTagsQuery) {
  return useQuery({
    queryKey: ['tags', query],
    queryFn: () => tagApi.getAllTags(query),
  });
}

export function useGetTag(id: number | string) {
  return useQuery({
    queryKey: ['tags', id],
    queryFn: () => tagApi.getTag(id),
    enabled: !!id,
  });
}

export function useCreateTag(
  options?: UseMutationOptions<CreateTagResponse, NormalizedErrorResponse, CreateTagRequest>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTagRequest) => tagApi.createTag(data),
    ...options,
    onSuccess: (...args) => {
      options?.onSuccess?.(...args);
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useUpdateTag(
  options?: UseMutationOptions<UpdateTagResponse, NormalizedErrorResponse, UpdateTagRequest>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number | string } & UpdateTagRequest) => tagApi.updateTag(id, data),
    ...options,
    onSuccess: (...args) => {
      options?.onSuccess?.(...args);
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => tagApi.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useAssignTagsToCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, data }: { companyId: number | string; data: AssignTagsRequest }) =>
      tagApi.assignTagsToCompany(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['company'] });
    },
  });
}

export function useUnassignTagsFromCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, data }: { companyId: number | string; data: UnassignTagsRequest }) =>
      tagApi.unassignTagsFromCompany(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['company'] });
    },
  });
}

export function useAssignTagsToContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contactId, data }: { contactId: number | string; data: AssignTagsRequest }) =>
      tagApi.assignTagsToContact(contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact'] });
    },
  });
}

export function useUnassignTagsFromContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contactId, data }: { contactId: number | string; data: UnassignTagsRequest }) =>
      tagApi.unassignTagsFromContact(contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact'] });
    },
  });
}
