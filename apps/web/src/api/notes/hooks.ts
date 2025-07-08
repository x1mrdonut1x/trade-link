import { useMutation, useQuery, useQueryClient, type MutationOptions } from '@tanstack/react-query';

import { notesApi } from './api';

import type {
  CreateNoteRequest,
  CreateNoteResponse,
  DeleteNoteResponse,
  GetAllNotesRequest,
  UpdateNoteRequest,
  UpdateNoteResponse,
} from '@tradelink/shared';
import { useTenantParam } from 'hooks/use-tenant-param';

const NOTES_QUERY_KEY = 'notes';

export function useGetAllNotes(query?: GetAllNotesRequest) {
  const tenantId = useTenantParam();

  return useQuery({
    queryKey: [NOTES_QUERY_KEY, query],
    queryFn: () => notesApi(tenantId).getAllNotes(query),
  });
}

export function useGetNote(id: number | string) {
  const tenantId = useTenantParam();

  return useQuery({
    queryKey: [NOTES_QUERY_KEY, id],
    queryFn: () => notesApi(tenantId).getNote(id),
    enabled: !!id,
  });
}

export function useCreateNote(options?: MutationOptions<CreateNoteResponse, Error, CreateNoteRequest>) {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi(tenantId).createNote,
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.resetQueries({ queryKey: [NOTES_QUERY_KEY] });
      if (variables.contactId) {
        queryClient.resetQueries({ queryKey: [NOTES_QUERY_KEY, 'contact', variables.contactId] });
      }
      if (variables.companyId) {
        queryClient.resetQueries({ queryKey: [NOTES_QUERY_KEY, 'company', variables.companyId] });
      }
    },
  });
}

export function useUpdateNote(
  options?: MutationOptions<UpdateNoteResponse, Error, { id: number; data: UpdateNoteRequest }>
) {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNoteRequest }) => notesApi(tenantId).updateNote(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.resetQueries({ queryKey: [NOTES_QUERY_KEY] });
      queryClient.resetQueries({ queryKey: [NOTES_QUERY_KEY, variables.id] });
      if (data.contactId) {
        queryClient.resetQueries({ queryKey: [NOTES_QUERY_KEY, 'contact', data.contactId] });
      }
      if (data.companyId) {
        queryClient.resetQueries({ queryKey: [NOTES_QUERY_KEY, 'company', data.companyId] });
      }
    },
  });
}

export function useDeleteNote(options?: MutationOptions<DeleteNoteResponse, Error, number>) {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi(tenantId).deleteNote,
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.resetQueries({ queryKey: [NOTES_QUERY_KEY] });
      queryClient.removeQueries({ queryKey: [NOTES_QUERY_KEY, variables] });
    },
  });
}
