// Contact DTOs - Plain TypeScript interfaces for return types

export interface ContactDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  contactData: unknown;
  // contactData: {
  //   country: string | null;
  //   city: string | null;
  //   address: string | null;
  //   postCode: string | null;
  //   phonePrefix: string | null;
  //   phoneNumber: string | null;
  // } | null;
  companyId: number | null;
  jobTitle: string | null;
}

export interface ContactWithCompanyDto extends ContactDto {
  company: {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
  } | null;
}

export interface ContactListDto {
  contacts: ContactWithCompanyDto[];
  total: number;
}

export interface DeleteContactResponseDto {
  success: boolean;
  message: string;
}
