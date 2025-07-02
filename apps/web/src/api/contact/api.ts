import type { ContactWithCompanyDto, CreateContactType, DeleteContactResponseDto, UpdateContactType } from '@tradelink/shared/contact';
import { myFetch } from '../client';

export const contactApi = {
  getAllContacts: (search?: string): Promise<ContactWithCompanyDto[]> => {
    return myFetch<ContactWithCompanyDto[]>('contacts', { query: { search } });
  },

  getContact: (id: number | string): Promise<ContactWithCompanyDto> => myFetch<ContactWithCompanyDto>(`contacts/${id}`),

  createContact: (data: CreateContactType): Promise<ContactWithCompanyDto> =>
    myFetch<ContactWithCompanyDto>('contacts', { method: 'POST', body: data }),

  updateContact: (id: number | string, data: UpdateContactType): Promise<ContactWithCompanyDto> =>
    myFetch<ContactWithCompanyDto>(`contacts/${id}`, { method: 'PUT', body: data }),

  deleteContact: (id: number | string): Promise<DeleteContactResponseDto> =>
    myFetch<DeleteContactResponseDto>(`contacts/${id}`, { method: 'DELETE' }),
};
