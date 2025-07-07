import type { ContactDto } from '../contact';
import type { TagDto } from '../tags';

export interface CompanyDto {
  id: number;
  name: string;
  email: string | null;
  description: string | null;
  phonePrefix: string | null;
  phoneNumber: string | null;
  size: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  postCode: string | null;
  tags?: TagDto[];
}

export type GetCompanyResponse = CompanyDto & {
  contact: Pick<ContactDto, 'id' | 'firstName' | 'lastName' | 'email' | 'jobTitle'>[];
};

export type GetAllCompaniesResponse = (CompanyDto & { contacts: number })[];

export type CreateCompanyResponse = CompanyDto;

export type UpdateCompanyResponse = CompanyDto;

export type DeleteCompanyResponse = {
  success: boolean;
  message: string;
};
