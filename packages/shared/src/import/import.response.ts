import type { CompanyImportData, ContactImportData } from './import.request';

export interface ImportExecuteResponse {
  success: boolean;
  stats: {
    totalRecords: number;
    companies: number;
    contacts: number;
    errors: number;
  };
  errors?: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

export interface DuplicateEmailError {
  email: string;
  type: 'company' | 'contact';
  rows: number[]; // Array of row numbers (1-based) that have this duplicate email
  existingEntity?: {
    id: number;
    name: string;
  };
}

export interface DuplicateNameError {
  name: string;
  type: 'company';
  rows: number[]; // Array of row numbers (1-based) that have this duplicate name
  existingEntity?: {
    id: number;
    name: string;
  };
}

export interface ImportPreviewResponse {
  companies: ImportEntry<CompanyImportData>[];
  contacts: ImportEntry<ContactImportData>[];
  truncated?: boolean;
  totalRows?: number;
  duplicateEmailErrors?: DuplicateEmailError[];
  duplicateNameErrors?: DuplicateNameError[];
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
  companyId?: number;
}
