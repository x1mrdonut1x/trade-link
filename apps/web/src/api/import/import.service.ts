import type { FieldMapping, ImportPreviewResponse } from '../../components/import/types';

export interface ImportProcessRequest {
  csvData: string[][];
  fieldMappings: FieldMapping[];
  importType: 'companies' | 'contacts' | 'mixed';
}

export interface ImportExecuteRequest {
  companies: Array<{
    data: any;
    action: 'create' | 'update';
    existingId?: number;
  }>;
  contacts: Array<{
    data: any;
    action: 'create' | 'update';
    existingId?: number;
    companyId?: number;
  }>;
}

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

export class ImportAPI {
  private static baseUrl = '/api';

  static async processImport(request: ImportProcessRequest): Promise<ImportPreviewResponse> {
    const response = await fetch(`${this.baseUrl}/import/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async executeImport(request: ImportExecuteRequest): Promise<ImportExecuteResponse> {
    const response = await fetch(`${this.baseUrl}/import/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async downloadTemplate(type: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/import/template/${type}`);

    if (!response.ok) {
      throw new Error(`Failed to download template: ${response.status}`);
    }

    const blob = await response.blob();
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.csv`;
    document.body.append(a);
    a.click();
    globalThis.URL.revokeObjectURL(url);
    a.remove();
  }
}
