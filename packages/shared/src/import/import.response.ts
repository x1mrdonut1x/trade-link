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

export interface ImportPreviewResponse {
  companies: ImportEntry<CompanyImportData>[];
  contacts: ImportEntry<ContactImportData>[];
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
