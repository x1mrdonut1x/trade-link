import { BadRequestException } from '@nestjs/common';
import { CompanyImportData, ContactImportData, ImportEntry, type ImportFieldMappings } from '@tradelink/shared';
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
   * Checks if the given ID is a temporary company ID
   * Temporary IDs are negative numbers used during import processing
   */
  isTemporaryCompanyId(id: number): boolean {
    return id < 0;
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
   * Finds a company by its temporary ID in the temporary companies map
   */
  findCompanyByTempId(
    tempCompaniesByName: Map<string, { id: number; name: string; isTemp: boolean }>,
    tempId: number
  ): { id: number; name: string } | undefined {
    for (const company of tempCompaniesByName.values()) {
      if (company.id === tempId) {
        return { id: company.id, name: company.name };
      }
    }
    return undefined;
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

  convertCompanyCsvToImportEntries(
    csvData: string[][],
    fieldMappings: ImportFieldMappings
  ): ImportEntry<CompanyImportData>[] {
    const headerRow = csvData[0];
    const dataRows = csvData.slice(1);

    return dataRows.map(row => {
      const companyData: any = {};

      // Map CSV columns to company fields
      for (const mapping of fieldMappings.companyMappings) {
        const columnIndex = headerRow.indexOf(mapping.targetField);
        if (columnIndex !== -1 && row[columnIndex] != null) {
          companyData[mapping.targetField] = row[columnIndex].trim();
        }
      }

      return {
        data: companyData,
        action: 'create' as const,
        existingId: undefined,
        selected: true,
      };
    });
  },

  convertContactCsvToImportEntries(
    csvData: string[][],
    fieldMappings: ImportFieldMappings
  ): ImportEntry<ContactImportData>[] {
    const headerRow = csvData[0];
    const dataRows = csvData.slice(1);

    return dataRows.map(row => {
      const contactData: any = {};

      // Map CSV columns to contact fields
      for (const mapping of fieldMappings.contactMappings) {
        const columnIndex = headerRow.indexOf(mapping.targetField);
        if (columnIndex !== -1 && row[columnIndex] != null) {
          contactData[mapping.targetField] = row[columnIndex].trim();
        }
      }

      return {
        data: contactData,
        action: 'create' as const,
        existingId: undefined,
        companyId: undefined,
        matchedCompany: undefined,
        selected: true,
      };
    });
  },

  async parseCSV(csvFile: Express.Multer.File): Promise<string[][]> {
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

          resolve(csvData);
        },
        error: error => {
          reject(new BadRequestException(`Failed to parse CSV: ${error.message}`));
        },
      });
    });
  },
} as const;
