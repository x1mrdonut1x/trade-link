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

export const contactApi = {
  getAllContacts: (query: Partial<GetAllContactsQuery>) => {
    return myFetch<GetAllContactsResponse>('contacts', { query });
  },

  getContact: (id: number | string) => {
    return myFetch<GetContactResponse>(`contacts/${id}`);
  },

  createContact: (data: CreateContactRequest) => {
    return myFetch<CreateContactResponse>('contacts', { method: 'POST', body: data });
  },

  updateContact: (id: number | string, data: UpdateContactRequest) => {
    return myFetch<UpdateContactResponse>(`contacts/${id}`, { method: 'PUT', body: data });
  },

  deleteContact: (id: number | string) => {
    return myFetch<DeleteContactResponse>(`contacts/${id}`, { method: 'DELETE' });
  },
};
