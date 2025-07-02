import type { CompanyDto } from '../company';

export interface ContactDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle?: string | null;
  phonePrefix?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  postCode?: string | null;
  companyId?: number | null;
}

export type ContactWithCompanyDto = ContactDto & {
  company?: Pick<CompanyDto, 'id' | 'name' | 'phoneNumber' | 'phonePrefix' | 'email'> | null;
};

export type GetContactResponse = ContactWithCompanyDto;

export type GetAllContactsResponse = ContactWithCompanyDto[];

export type CreateContactResponse = ContactDto;

export type UpdateContactResponse = ContactDto;

export type DeleteContactResponse = {
  success: boolean;
  message: string;
};
