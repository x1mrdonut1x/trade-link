import { useMutation, useQuery, useQueryClient, type MutationOptions } from '@tanstack/react-query';
import type { CreateContactRequest, CreateContactResponse, UpdateContactRequest, UpdateContactResponse } from '@tradelink/shared';
import { contactApi } from './api';

const CONTACTS_QUERY_KEY = 'contacts';

export function useGetAllContacts(search?: string) {
  return useQuery({
    queryKey: [CONTACTS_QUERY_KEY, search],
    queryFn: () => contactApi.getAllContacts(search),
  });
}

export function useGetContact(id: number | string) {
  return useQuery({
    queryKey: [CONTACTS_QUERY_KEY, id],
    queryFn: () => contactApi.getContact(id),
    enabled: !!id,
  });
}

export function useCreateContact(options?: MutationOptions<CreateContactResponse, Error, CreateContactRequest>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactApi.createContact,
    ...options,
    onSuccess: (...args) => {
      options?.onSuccess?.(...args);
      queryClient.resetQueries({ queryKey: [CONTACTS_QUERY_KEY] });
    },
  });
}

export function useUpdateContact(options?: MutationOptions<UpdateContactResponse, Error, { id: number; data: UpdateContactRequest }>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateContactRequest }) => contactApi.updateContact(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.resetQueries({ queryKey: [CONTACTS_QUERY_KEY] });
      queryClient.resetQueries({ queryKey: [CONTACTS_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactApi.deleteContact,
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: [CONTACTS_QUERY_KEY] });
    },
  });
}
