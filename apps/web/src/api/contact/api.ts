import type { ContactWithCompanyDto, CreateContactType, DeleteContactResponseDto, UpdateContactType } from '@tradelink/shared/contact';
import { myFetch } from '../client';

export const contactApi = {
  getAllContacts: (): Promise<ContactWithCompanyDto[]> => myFetch<ContactWithCompanyDto[]>('contacts'),

  getContact: (id: number): Promise<ContactWithCompanyDto> => myFetch<ContactWithCompanyDto>(`contacts/${id}`),

  createContact: (data: CreateContactType): Promise<ContactWithCompanyDto> =>
    myFetch<ContactWithCompanyDto>('contacts', { method: 'POST', body: data }),

  updateContact: (id: number, data: UpdateContactType): Promise<ContactWithCompanyDto> =>
    myFetch<ContactWithCompanyDto>(`contacts/${id}`, { method: 'PUT', body: data }),

  deleteContact: (id: number): Promise<DeleteContactResponseDto> =>
    myFetch<DeleteContactResponseDto>(`contacts/${id}`, { method: 'DELETE' }),
};
