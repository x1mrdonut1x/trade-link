import { useMutation, useQuery, useQueryClient, type MutationOptions } from '@tanstack/react-query';

import { contactApi } from './api';

import type {
  CreateContactRequest,
  CreateContactResponse,
  GetAllContactsQuery,
  UpdateContactRequest,
  UpdateContactResponse,
} from '@tradelink/shared/contact';
import { useTenantParam } from 'hooks/use-tenant-param';

const CONTACTS_QUERY_KEY = 'contacts';

export function useGetAllContacts(query: Partial<GetAllContactsQuery>) {
  const tenantId = useTenantParam();

  return useQuery({
    queryKey: [CONTACTS_QUERY_KEY, query],
    queryFn: () => contactApi(tenantId).getAllContacts(query),
  });
}

export function useGetContact(id: number | string) {
  const tenantId = useTenantParam();
  return useQuery({
    queryKey: [CONTACTS_QUERY_KEY, id],
    queryFn: () => contactApi(tenantId).getContact(id),
    enabled: !!id,
  });
}

export function useCreateContact(options?: MutationOptions<CreateContactResponse, Error, CreateContactRequest>) {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactApi(tenantId).createContact,
    ...options,
    onSuccess: (...args) => {
      options?.onSuccess?.(...args);
      queryClient.resetQueries({ queryKey: [CONTACTS_QUERY_KEY] });
    },
  });
}

export function useUpdateContact(
  options?: MutationOptions<UpdateContactResponse, Error, { id: number; data: UpdateContactRequest }>
) {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateContactRequest }) =>
      contactApi(tenantId).updateContact(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.resetQueries({ queryKey: [CONTACTS_QUERY_KEY] });
      queryClient.resetQueries({ queryKey: [CONTACTS_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteContact() {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactApi(tenantId).deleteContact,
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: [CONTACTS_QUERY_KEY] });
    },
  });
}
