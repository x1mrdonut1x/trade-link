import type {
  CreateContactRequest,
  CreateContactResponse,
  DeleteContactResponse,
  GetAllContactsResponse,
  GetContactResponse,
  UpdateContactRequest,
  UpdateContactResponse,
} from '@tradelink/shared';
import { myFetch } from '../client';

export const contactApi = {
  getAllContacts: (search?: string) => {
    return myFetch<GetAllContactsResponse>('contacts', { query: { search } });
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
