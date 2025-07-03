import type { ContactDto } from '../contact';

export interface CompanyDto {
  id: number;
  name: string;
  email: string | null;
  description: string | null;
  phonePrefix: string | null;
  phoneNumber: string | null;
  size: string | null;
  website: string | null;
  // tags: string[] | null;
  address: string | null;
  city: string | null;
  country: string | null;
  postCode: string | null;
}

export type GetCompanyResponse = CompanyDto & { contact: Pick<ContactDto, 'id' | 'firstName' | 'lastName' | 'email' | 'jobTitle'>[] };

export type GetAllCompaniesResponse = (CompanyDto & { contacts: number })[];

export type CreateCompanyResponse = CompanyDto;

export type UpdateCompanyResponse = CompanyDto;

export type DeleteCompanyResponse = {
  success: boolean;
  message: string;
};
