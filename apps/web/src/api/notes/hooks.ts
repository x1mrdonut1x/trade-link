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

const NOTES_QUERY_KEY = 'notes';

export function useGetAllNotes(query?: GetAllNotesRequest) {
  return useQuery({
    queryKey: [NOTES_QUERY_KEY, query],
    queryFn: () => notesApi.getAllNotes(query),
  });
}

export function useGetNote(id: number | string) {
  return useQuery({
    queryKey: [NOTES_QUERY_KEY, id],
    queryFn: () => notesApi.getNote(id),
    enabled: !!id,
  });
}

export function useCreateNote(options?: MutationOptions<CreateNoteResponse, Error, CreateNoteRequest>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.createNote,
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNoteRequest }) => notesApi.updateNote(id, data),
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.deleteNote,
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.resetQueries({ queryKey: [NOTES_QUERY_KEY] });
      queryClient.removeQueries({ queryKey: [NOTES_QUERY_KEY, variables] });
    },
  });
}
