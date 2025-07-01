import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UpdateContactType } from '@tradelink/shared/contact';
import { contactApi } from './api';

const CONTACTS_QUERY_KEY = 'contacts';

export function useContacts() {
  return useQuery({
    queryKey: [CONTACTS_QUERY_KEY],
    queryFn: contactApi.getAllContacts,
  });
}

export function useContact(id: number) {
  return useQuery({
    queryKey: [CONTACTS_QUERY_KEY, id],
    queryFn: () => contactApi.getContact(id),
    enabled: !!id,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactApi.createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTACTS_QUERY_KEY] });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateContactType }) => contactApi.updateContact(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CONTACTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CONTACTS_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactApi.deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTACTS_QUERY_KEY] });
    },
  });
}
