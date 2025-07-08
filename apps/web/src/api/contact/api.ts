import { myFetch } from '../client';

import type {
  CreateContactRequest,
  CreateContactResponse,
  DeleteContactResponse,
  GetAllContactsQuery,
  GetAllContactsResponse,
  GetContactResponse,
  UpdateContactRequest,
  UpdateContactResponse,
} from '@tradelink/shared';

export const contactApi = (tenantId: string) => ({
  getAllContacts: (query: Partial<GetAllContactsQuery>) => {
    return myFetch<GetAllContactsResponse>(tenantId, 'contacts', { query });
  },

  getContact: (id: number | string) => {
    return myFetch<GetContactResponse>(tenantId, `contacts/${id}`);
  },

  createContact: (data: CreateContactRequest) => {
    return myFetch<CreateContactResponse>(tenantId, 'contacts', { method: 'POST', body: data });
  },

  updateContact: (id: number | string, data: UpdateContactRequest) => {
    return myFetch<UpdateContactResponse>(tenantId, `contacts/${id}`, { method: 'PUT', body: data });
  },

  deleteContact: (id: number | string) => {
    return myFetch<DeleteContactResponse>(tenantId, `contacts/${id}`, { method: 'DELETE' });
  },
});
