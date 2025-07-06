import { BadRequestException } from '@nestjs/common';
import { CompanyImportData, ContactImportData, ImportEntry } from '@tradelink/shared';
import Papa from 'papaparse';

/**
 * Utility functions for import processing
 */
export const importUtils = {
  /**
   * Prepares contact data for saving by removing the companyName field
   * since it's not a valid field for contact creation in the database
   */
  prepareContactDataForSave(contactData: ContactImportData): Omit<ContactImportData, 'companyName'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { companyName, ...contactDataWithoutCompanyName } = contactData;
    return contactDataWithoutCompanyName;
  },

  /**
   * Normalizes company name for consistent comparison and storage
   * Converts to lowercase and trims whitespace
   */
  normalizeCompanyName(name: string): string {
    return name.trim().toLowerCase();
  },

  /**
   * Removes falsy values from an object
   * Specifically removes properties with `false` values
   */
  removeFalsyValues(obj: Record<string, unknown>): void {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] === false) {
        delete obj[key];
      }
    }
  },

  /**
   * Separates companies into create and update operations
   */
  separateCompaniesForBatch(companies: ImportEntry<CompanyImportData>[]) {
    return {
      companiesToCreate: companies.filter(c => c.action === 'create'),
      companiesToUpdate: companies.filter(c => c.action === 'update'),
    };
  },

  /**
   * Separates contacts into create and update operations
   */
  separateContactsForBatch(contacts: ImportEntry<ContactImportData>[]) {
    return {
      contactsToCreate: contacts.filter(c => c.action === 'create'),
      contactsToUpdate: contacts.filter(c => c.action === 'update'),
    };
  },

  /**
   * Helper function to convert CSV data to import entries
   */
  convertCsvToImportEntries<T extends CompanyImportData | ContactImportData>(
    csvData: string[][],
    fieldMappings: { csvColumnIndex: number; targetField: keyof T }[],
    skippedRows?: number[]
  ): ImportEntry<T>[] {
    if (csvData.length === 0) return [];

    const headerRow = csvData[0];
    const dataRows = csvData.slice(1);

    // Find special field indices
    const existingIdIndex = headerRow.indexOf('__existingId');
    const companyIdIndex = headerRow.indexOf('__companyId');

    return dataRows.map((row, index) => {
      const data: T = {} as T;

      // Map CSV columns to data fields using column indices
      for (const mapping of fieldMappings) {
        if (mapping.csvColumnIndex < row.length && row[mapping.csvColumnIndex] != null) {
          const value = row[mapping.csvColumnIndex].trim();
          if (value !== '') {
            data[mapping.targetField] = value as T[keyof T];
          }
        }
      }

      // Extract special fields
      const existingId =
        existingIdIndex !== -1 && row[existingIdIndex]
          ? Number.parseInt(row[existingIdIndex].trim()) || undefined
          : undefined;

      const companyId =
        companyIdIndex !== -1 && row[companyIdIndex]
          ? Number.parseInt(row[companyIdIndex].trim()) || undefined
          : undefined;

      return {
        data,
        action: existingId ? ('update' as const) : ('create' as const),
        existingId,
        selected: !skippedRows || !skippedRows.includes(index),
        companyId,
      };
    });
  },

  async parseCSV(csvFile: Express.Multer.File): Promise<{ data: string[][]; truncated: boolean; totalRows: number }> {
    return new Promise((resolve, reject) => {
      const fileContent = csvFile.buffer.toString('utf8');

      Papa.parse(fileContent, {
        header: false,
        skipEmptyLines: true,
        complete: results => {
          if (results.errors.length > 0) {
            reject(new BadRequestException(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
            return;
          }

          const csvData = results.data as string[][];

          // Validate that we actually received string arrays
          if (!Array.isArray(csvData) || (csvData.length > 0 && !Array.isArray(csvData[0]))) {
            reject(new BadRequestException('Invalid CSV data format received from parser'));
            return;
          }

          const totalRows = csvData.length;
          const ROW_LIMIT = 40_000;
          const truncated = totalRows > ROW_LIMIT;

          // If data exceeds limit, truncate to first 10k rows (including header)
          const limitedData = truncated ? csvData.slice(0, ROW_LIMIT) : csvData;

          resolve({
            data: limitedData,
            truncated,
            totalRows,
          });
        },
        error: error => {
          reject(new BadRequestException(`Failed to parse CSV: ${error.message}`));
        },
      });
    });
  },
} as const;
