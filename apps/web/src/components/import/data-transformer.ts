import type { CompanyImportData, ContactImportData, CsvColumn, FieldMapping, ImportType } from './types';

export function transformCsvData(
  csvColumns: CsvColumn[],
  fieldMappings: FieldMapping[],
  importType: ImportType
): { companies: CompanyImportData[]; contacts: ContactImportData[] } {
  const companies: CompanyImportData[] = [];
  const contacts: ContactImportData[] = [];

  // Get the number of rows (assuming all columns have the same number of values)
  const rowCount = csvColumns[0]?.values.length || 0;

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const rowData: Record<string, string> = {};

    // Build row data from mappings
    for (const mapping of fieldMappings) {
      const column = csvColumns.find(col => col.name === mapping.csvColumn);
      if (column) {
        rowData[mapping.targetField] = column.values[rowIndex] || '';
      }
    }

    // Determine if this row represents a company, contact, or both
    const hasCompanyData = hasRequiredCompanyFields(rowData);
    const hasContactData = hasRequiredContactFields(rowData);

    if ((importType === 'companies' || (importType === 'mixed' && hasCompanyData)) && hasRequiredCompanyFields(rowData)) {
        companies.push(transformToCompanyData(rowData));
      }

    if ((importType === 'contacts' || (importType === 'mixed' && hasContactData)) && hasRequiredContactFields(rowData)) {
        contacts.push(transformToContactData(rowData));
      }
  }

  return { companies, contacts };
}

function hasRequiredCompanyFields(data: Record<string, string>): boolean {
  return !!data.name?.trim();
}

function hasRequiredContactFields(data: Record<string, string>): boolean {
  return !!data.firstName?.trim() && !!data.lastName?.trim() && !!data.email?.trim();
}

function transformToCompanyData(data: Record<string, string>): CompanyImportData {
  return {
    name: data.name?.trim() || '',
    email: data.email?.trim() || undefined,
    phonePrefix: data.phonePrefix?.trim() || undefined,
    phoneNumber: data.phoneNumber?.trim() || undefined,
    description: data.description?.trim() || undefined,
    website: data.website?.trim() || undefined,
    size: data.size?.trim() || undefined,
    address: data.address?.trim() || undefined,
    city: data.city?.trim() || undefined,
    country: data.country?.trim() || undefined,
    postCode: data.postCode?.trim() || undefined,
  };
}

function transformToContactData(data: Record<string, string>): ContactImportData {
  return {
    firstName: data.firstName?.trim() || '',
    lastName: data.lastName?.trim() || '',
    email: data.email?.trim() || '',
    jobTitle: data.jobTitle?.trim() || undefined,
    phonePrefix: data.phonePrefix?.trim() || undefined,
    phoneNumber: data.phoneNumber?.trim() || undefined,
    address: data.address?.trim() || undefined,
    city: data.city?.trim() || undefined,
    country: data.country?.trim() || undefined,
    postCode: data.postCode?.trim() || undefined,
    companyName: data.companyName?.trim() || undefined,
  };
}
