export interface ImportStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

export interface CsvColumn {
  name: string;
  values: string[];
}

export interface FieldMapping {
  csvColumn: string;
  targetField: string;
}

export interface CompanyImportData {
  name: string;
  email?: string;
  phonePrefix?: string;
  phoneNumber?: string;
  description?: string;
  website?: string;
  size?: string;
  address?: string;
  city?: string;
  country?: string;
  postCode?: string;
}

export interface ContactImportData {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle?: string;
  phonePrefix?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  postCode?: string;
  companyName?: string; // For matching with companies
}

export interface ImportEntry<T = CompanyImportData | ContactImportData> {
  data: T;
  action: 'create' | 'update';
  existingId?: number;
  selected: boolean;
  matchedCompany?: {
    id: number;
    name: string;
  };
}

export interface ImportPreviewResponse {
  companies: ImportEntry<CompanyImportData>[];
  contacts: ImportEntry<ContactImportData>[];
}

export type ImportType = 'companies' | 'contacts' | 'mixed';

export const COMPANY_FIELDS = [
  { key: 'name', label: 'Company Name', required: true },
  { key: 'email', label: 'Email', required: false },
  { key: 'phonePrefix', label: 'Phone Prefix', required: false },
  { key: 'phoneNumber', label: 'Phone Number', required: false },
  { key: 'description', label: 'Description', required: false },
  { key: 'website', label: 'Website', required: false },
  { key: 'size', label: 'Company Size', required: false },
  { key: 'address', label: 'Address', required: false },
  { key: 'city', label: 'City', required: false },
  { key: 'country', label: 'Country', required: false },
  { key: 'postCode', label: 'Post Code', required: false },
] as const;

export const CONTACT_FIELDS = [
  { key: 'firstName', label: 'First Name', required: true },
  { key: 'lastName', label: 'Last Name', required: true },
  { key: 'email', label: 'Email', required: true },
  { key: 'jobTitle', label: 'Job Title', required: false },
  { key: 'phonePrefix', label: 'Phone Prefix', required: false },
  { key: 'phoneNumber', label: 'Phone Number', required: false },
  { key: 'address', label: 'Address', required: false },
  { key: 'city', label: 'City', required: false },
  { key: 'country', label: 'Country', required: false },
  { key: 'postCode', label: 'Post Code', required: false },
  { key: 'companyName', label: 'Company Name', required: false },
] as const;
