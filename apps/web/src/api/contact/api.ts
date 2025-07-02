import type { ContactWithCompanyDto, CreateContactType, DeleteContactResponseDto, UpdateContactType } from '@tradelink/shared/contact';
import { myFetch } from '../client';

export const contactApi = {
  getAllContacts: (search?: string): Promise<ContactWithCompanyDto[]> => {
    return myFetch<ContactWithCompanyDto[]>('contacts', { query: { search } });
  },

  getContact: (id: number | string) => {
    return myFetch<ContactWithCompanyDto>(`contacts/${id}`);
  },

  createContact: (data: CreateContactType) => {
    return myFetch<ContactWithCompanyDto>('contacts', { method: 'POST', body: data });
  },

  updateContact: (id: number | string, data: UpdateContactType) => {
    return myFetch<ContactWithCompanyDto>(`contacts/${id}`, { method: 'PUT', body: data });
  },

  deleteContact: (id: number | string) => {
    return myFetch<DeleteContactResponseDto>(`contacts/${id}`, { method: 'DELETE' });
  },
};
