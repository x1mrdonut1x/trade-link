import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CompanyImportData,
  ContactImportData,
  ImportEntry,
  ImportExecuteRequest,
  ImportExecuteResponse,
  ImportFieldMappings,
  ImportPreviewResponse,
  ImportProcessRequest,
  companyImportDataSchema,
  contactImportDataSchema,
} from '@tradelink/shared';

import type { Prisma } from 'generated/prisma';
import { CompanyService } from '../company/company.service';
import { ContactService } from '../contact/contact.service';
import { PrismaService } from '../prisma/prisma.service';
import { importUtils } from './import.util';

// Internal format for processing imports
interface ImportExecutionData {
  companies: ImportEntry<CompanyImportData>[];
  contacts: ImportEntry<ContactImportData>[];
}

interface CompanyLookupMaps {
  existingCompaniesByName: Map<string, { id: number; name: string }>;
  tempCompaniesByName: Map<string, { id: number; name: string; isTemp: boolean }>;
  tempToRealIdMap: Map<number, number>;
  nameToRealIdMap: Map<string, number>;
}

@Injectable()
export class ImportService {
  constructor(
    private prisma: PrismaService,
    private companyService: CompanyService,
    private contactService: ContactService
  ) {}

  async processImport(request: ImportProcessRequest, csvFile: Express.Multer.File): Promise<ImportPreviewResponse> {
    if (!csvFile) {
      throw new BadRequestException('CSV file is required');
    }
    const csvData = await importUtils.parseCSV(csvFile);
    const dataRows = csvData.slice(1); // Skip header row

    if (dataRows.length === 0) {
      throw new BadRequestException('CSV data is empty');
    }

    // Initialize lookup maps
    const companyMaps = await this.initializeCompanyMaps(dataRows, request.fieldMappings);

    // Process all rows and collect import entries
    const { companies, contacts } = await this.processAllRows(dataRows, request, companyMaps);

    return { companies, contacts };
  }

  private async initializeCompanyMaps(
    dataRows: string[][],
    fieldMappings: ImportFieldMappings
  ): Promise<CompanyLookupMaps> {
    const companyNamesToLookup = this.collectCompanyNames(dataRows, fieldMappings);
    const existingCompaniesByName = await this.fetchCompaniesByNameForPreview(companyNamesToLookup);

    return {
      existingCompaniesByName,
      tempCompaniesByName: new Map(),
      tempToRealIdMap: new Map(),
      nameToRealIdMap: new Map(),
    };
  }

  private collectCompanyNames(dataRows: string[][], fieldMappings: ImportFieldMappings): Set<string> {
    const companyNames = new Set<string>();

    for (const row of dataRows) {
      const { companyData, contactData } = this.mapRowToData(row, fieldMappings);

      if (companyData?.name) {
        companyNames.add(companyData.name);
      }
      if (contactData?.companyName) {
        companyNames.add(contactData.companyName);
      }
    }

    return companyNames;
  }

  private async processAllRows(
    dataRows: string[][],
    request: ImportProcessRequest,
    companyMaps: CompanyLookupMaps
  ): Promise<{ companies: ImportEntry<CompanyImportData>[]; contacts: ImportEntry<ContactImportData>[] }> {
    const companies: ImportEntry<CompanyImportData>[] = [];
    const contacts: ImportEntry<ContactImportData>[] = [];
    let tempIdCounter = -1;

    for (const [index, row] of dataRows.entries()) {
      try {
        const { companyData, contactData } = this.mapRowToData(row, request.fieldMappings);

        let currentRowCompanyId: number | undefined;

        if (companyData && request.importType !== 'contacts') {
          currentRowCompanyId = await this.processCompanyEntry(companyData, companies, companyMaps, tempIdCounter--);
        }

        if (contactData && request.importType !== 'companies') {
          await this.processContactEntry(contactData, contacts, companyMaps, currentRowCompanyId);
        }
      } catch (error) {
        console.error(`Error processing row ${index + 1}:`, error);
        // Continue processing other rows
      }
    }

    return { companies, contacts };
  }

  private async processCompanyEntry(
    companyData: CompanyImportData,
    companies: ImportEntry<CompanyImportData>[],
    companyMaps: CompanyLookupMaps,
    tempId: number
  ): Promise<number> {
    const companyNameLower = importUtils.normalizeCompanyName(companyData.name);
    const existingCompanies = await this.companyService.findCompaniesByNames([companyNameLower]);
    const existingCompany = existingCompanies?.[0];

    let companyId: number;

    if (existingCompany) {
      companyId = existingCompany.id;
    } else {
      companyId = tempId;
      companyMaps.tempCompaniesByName.set(companyNameLower, {
        id: companyId,
        name: companyNameLower,
        isTemp: true,
      });
    }

    importUtils.removeFalsyValues(companyData);

    companies.push({
      data: companyData,
      action: existingCompany ? 'update' : 'create',
      existingId: existingCompany?.id,
      selected: true,
    });

    return companyId;
  }

  private async processContactEntry(
    contactData: ContactImportData,
    contacts: ImportEntry<ContactImportData>[],
    companyMaps: CompanyLookupMaps,
    currentRowCompanyId?: number
  ): Promise<void> {
    const existingContact = await this.contactService.findContactByEmail(contactData.email);
    const { matchedCompany, companyId } = this.resolveContactCompany(contactData, companyMaps, currentRowCompanyId);

    importUtils.removeFalsyValues(contactData);

    contacts.push({
      data: contactData,
      action: existingContact ? 'update' : 'create',
      existingId: existingContact?.id,
      selected: true,
      matchedCompany,
      companyId,
    });
  }

  private resolveContactCompany(
    contactData: ContactImportData,
    companyMaps: CompanyLookupMaps,
    currentRowCompanyId?: number
  ): { matchedCompany?: { id: number; name: string }; companyId?: number } {
    // Priority 1: Use company from the same row
    if (currentRowCompanyId) {
      const tempCompany = importUtils.findCompanyByTempId(companyMaps.tempCompaniesByName, currentRowCompanyId);
      if (tempCompany) {
        return {
          matchedCompany: { id: tempCompany.id, name: tempCompany.name },
          companyId: currentRowCompanyId,
        };
      }
    }

    // Priority 2: Look up company by name
    if (contactData.companyName) {
      const companyKey = importUtils.normalizeCompanyName(contactData.companyName);

      // Check temporary companies first
      const tempCompany = companyMaps.tempCompaniesByName.get(companyKey);
      if (tempCompany) {
        return {
          matchedCompany: { id: tempCompany.id, name: tempCompany.name },
          companyId: tempCompany.id,
        };
      }

      // Check existing companies
      const existingCompany = companyMaps.existingCompaniesByName.get(companyKey);
      if (existingCompany) {
        return {
          matchedCompany: { id: existingCompany.id, name: existingCompany.name },
          companyId: existingCompany.id,
        };
      }
    }

    return {};
  }

  /**
   * Executes the import process using Prisma transactions and batch operations for optimal performance.
   * All database operations are wrapped in a single transaction to ensure data consistency.
   */
  async executeImport(request: ImportExecutionData): Promise<ImportExecuteResponse> {
    const { companies, contacts } = request;

    const stats: ImportExecuteResponse['stats'] = {
      totalRecords: companies.length + contacts.length,
      companies: 0,
      contacts: 0,
      errors: 0,
    };

    const errors: ImportExecuteResponse['errors'] = [];

    try {
      await this.prisma.$transaction(async tx => {
        const companyMaps: CompanyLookupMaps = {
          existingCompaniesByName: new Map(),
          tempCompaniesByName: new Map(),
          tempToRealIdMap: new Map(),
          nameToRealIdMap: new Map(),
        };

        await this.processCompaniesImportBatch(companies, stats, errors, companyMaps, tx);
        await this.processContactsImportBatch(contacts, stats, errors, companyMaps, tx);
      });
    } catch (error) {
      errors.push({
        row: 0,
        field: 'transaction',
        message: error instanceof Error ? error.message : 'Transaction failed',
      });
      stats.errors++;
    }

    return {
      success: stats.errors === 0,
      stats,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async executeImportWithCsv(
    request: ImportExecuteRequest,
    companyCsvFile?: Express.Multer.File,
    contactCsvFile?: Express.Multer.File
  ): Promise<ImportExecuteResponse> {
    // Parse CSV files to extract the data
    const companyData = companyCsvFile ? await importUtils.parseCSV(companyCsvFile) : [];
    const contactData = contactCsvFile ? await importUtils.parseCSV(contactCsvFile) : [];

    // Convert CSV data to ImportExecuteRequest format
    const companies =
      companyData.length > 0 ? importUtils.convertCompanyCsvToImportEntries(companyData, request.fieldMappings) : [];
    const contacts =
      contactData.length > 0 ? importUtils.convertContactCsvToImportEntries(contactData, request.fieldMappings) : [];

    // Use the existing executeImport method with the converted data
    return this.executeImport({ companies, contacts });
  }

  private mapRowToData(
    row: string[],
    fieldMappings: ImportFieldMappings
  ): {
    companyData?: CompanyImportData;
    contactData?: ContactImportData;
  } {
    const companyData: Record<string, string> = {};
    const contactData: Record<string, string> = {};

    // Map company fields
    for (const mapping of fieldMappings.companyMappings) {
      if (mapping.csvColumnIndex < row.length && row[mapping.csvColumnIndex] != null) {
        companyData[mapping.targetField] = row[mapping.csvColumnIndex].trim();
      }
    }

    // Map contact fields
    for (const mapping of fieldMappings.contactMappings) {
      if (mapping.csvColumnIndex < row.length && row[mapping.csvColumnIndex] != null) {
        contactData[mapping.targetField] = row[mapping.csvColumnIndex].trim();
      }
    }

    return {
      companyData: companyImportDataSchema.safeParse(companyData).data,
      contactData: contactImportDataSchema.safeParse(contactData).data,
    };
  }

  private async fetchCompaniesByNameForPreview(
    companyNamesToLookup: Set<string>
  ): Promise<Map<string, { id: number; name: string }>> {
    const companiesByName = new Map<string, { id: number; name: string }>();

    if (companyNamesToLookup.size > 0) {
      const companies = await this.companyService.findCompaniesByNames([...companyNamesToLookup]);

      // Create a case-insensitive lookup map
      for (const company of companies) {
        companiesByName.set(company.name.toLowerCase(), company);
      }
    }

    return companiesByName;
  }

  private async processCompaniesImportBatch(
    companies: ImportEntry<CompanyImportData>[],
    stats: ImportExecuteResponse['stats'],
    errors: ImportExecuteResponse['errors'],
    companyMaps: CompanyLookupMaps,
    tx: Prisma.TransactionClient
  ): Promise<void> {
    if (companies.length === 0) return;

    const { companiesToCreate, companiesToUpdate } = importUtils.separateCompaniesForBatch(companies);

    try {
      await this.batchCreateCompanies(companiesToCreate, stats, companyMaps, tx);
      await this.batchUpdateCompanies(companiesToUpdate, stats, companyMaps, tx);
    } catch (error) {
      stats.errors++;
      errors?.push({
        row: stats.companies + stats.errors,
        field: 'company',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private async batchCreateCompanies(
    companiesToCreate: ImportEntry<CompanyImportData>[],
    stats: ImportExecuteResponse['stats'],
    companyMaps: CompanyLookupMaps,
    tx: Prisma.TransactionClient
  ): Promise<void> {
    if (companiesToCreate.length === 0) return;

    const createData = companiesToCreate.map(entry => entry.data);
    const createdCompanies = await this.companyService.createManyCompanies(createData, tx);

    // Map the created companies to their temporary IDs and names
    for (const [index, createdCompany] of createdCompanies.entries()) {
      const originalEntry = companiesToCreate[index];
      const companyNameLower = importUtils.normalizeCompanyName(originalEntry.data.name);

      // Store mapping from company name to actual ID
      companyMaps.nameToRealIdMap.set(companyNameLower, createdCompany.id);

      // If this was a temporary company, store the temp-to-real ID mapping
      if (originalEntry.existingId && importUtils.isTemporaryCompanyId(originalEntry.existingId)) {
        companyMaps.tempToRealIdMap.set(originalEntry.existingId, createdCompany.id);
      }
    }

    stats.companies += createdCompanies.length;
  }

  private async batchUpdateCompanies(
    companiesToUpdate: ImportEntry<CompanyImportData>[],
    stats: ImportExecuteResponse['stats'],
    companyMaps: CompanyLookupMaps,
    tx: Prisma.TransactionClient
  ): Promise<void> {
    if (companiesToUpdate.length === 0) return;

    // Prepare updates for the company service
    const updates = companiesToUpdate
      .filter(c => c.existingId)
      .map(c => ({
        id: c.existingId!,
        data: c.data,
      }));

    await this.companyService.bulkUpdateCompanies(updates, tx);

    // Store mapping from company name to actual ID
    for (const entry of companiesToUpdate) {
      if (entry.existingId) {
        const companyNameLower = importUtils.normalizeCompanyName(entry.data.name);
        companyMaps.nameToRealIdMap.set(companyNameLower, entry.existingId);
      }
    }

    stats.companies += updates.length;
  }

  private async processContactsImportBatch(
    contacts: ImportEntry<ContactImportData>[],
    stats: ImportExecuteResponse['stats'],
    errors: ImportExecuteResponse['errors'],
    companyMaps: CompanyLookupMaps,
    tx: Prisma.TransactionClient
  ): Promise<void> {
    if (contacts.length === 0) return;

    // Pre-fetch all companies to avoid N+1 queries
    const companiesByName = await this.fetchCompaniesByNameForBatch(contacts);

    // Merge the newly created companies with the existing ones
    for (const [name, companyId] of companyMaps.nameToRealIdMap.entries()) {
      companiesByName.set(name, { id: companyId, name });
    }

    const { contactsToCreate, contactsToUpdate } = importUtils.separateContactsForBatch(contacts);

    try {
      await this.batchCreateContacts(contactsToCreate, stats, companiesByName, companyMaps, tx);
      await this.batchUpdateContacts(contactsToUpdate, stats, companiesByName, companyMaps, tx);
    } catch (error) {
      stats.errors++;
      errors?.push({
        row: stats.contacts + stats.errors,
        field: 'contact',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private async fetchCompaniesByNameForBatch(
    contacts: ImportEntry<ContactImportData>[]
  ): Promise<Map<string, { id: number; name: string }>> {
    // Collect all unique company names that need to be looked up
    const companyNamesToLookup = new Set<string>();

    for (const contactEntry of contacts) {
      if (!contactEntry.companyId && contactEntry.data.companyName) {
        companyNamesToLookup.add(contactEntry.data.companyName.trim());
      }
    }

    // Fetch all companies by name using the company service
    const companiesByName = new Map<string, { id: number; name: string }>();

    if (companyNamesToLookup.size > 0) {
      const companies = await this.companyService.findCompaniesByNames([...companyNamesToLookup]);

      // Create a case-insensitive lookup map
      for (const company of companies) {
        companiesByName.set(company.name.toLowerCase(), company);
      }
    }

    return companiesByName;
  }

  private async batchCreateContacts(
    contactsToCreate: ImportEntry<ContactImportData>[],
    stats: ImportExecuteResponse['stats'],
    companiesByName: Map<string, { id: number; name: string }>,
    companyMaps: CompanyLookupMaps,
    tx: Prisma.TransactionClient
  ): Promise<void> {
    if (contactsToCreate.length === 0) return;

    const createData = contactsToCreate.map(contactEntry => {
      const companyId = this.resolveCompanyIdForBatch(contactEntry, companiesByName, companyMaps);
      const contactDataWithoutCompanyName = importUtils.prepareContactDataForSave(contactEntry.data);

      return {
        ...contactDataWithoutCompanyName,
        companyId,
      };
    });

    await this.contactService.createManyContacts(createData, tx);

    stats.contacts += contactsToCreate.length;
  }

  private async batchUpdateContacts(
    contactsToUpdate: ImportEntry<ContactImportData>[],
    stats: ImportExecuteResponse['stats'],
    companiesByName: Map<string, { id: number; name: string }>,
    companyMaps: CompanyLookupMaps,
    tx: Prisma.TransactionClient
  ): Promise<void> {
    if (contactsToUpdate.length === 0) return;

    // Prepare updates for the contact service
    const updates = contactsToUpdate
      .filter(c => c.existingId)
      .map(contactEntry => {
        const companyId = this.resolveCompanyIdForBatch(contactEntry, companiesByName, companyMaps);
        const contactDataWithoutCompanyName = importUtils.prepareContactDataForSave(contactEntry.data);

        return {
          id: contactEntry.existingId!,
          data: {
            ...contactDataWithoutCompanyName,
            companyId,
          },
        };
      });

    await this.contactService.bulkUpdateContacts(updates, tx);

    stats.contacts += updates.length;
  }

  private resolveCompanyIdForBatch(
    contactEntry: ImportEntry<ContactImportData>,
    companiesByName: Map<string, { id: number; name: string }>,
    companyMaps: CompanyLookupMaps
  ): number | undefined {
    // First check if we have a companyId from the contact entry
    if (contactEntry.companyId) {
      // If it's a temporary ID (negative), map it to the actual ID
      if (importUtils.isTemporaryCompanyId(contactEntry.companyId)) {
        const actualCompanyId = companyMaps.tempToRealIdMap.get(contactEntry.companyId);
        if (actualCompanyId) {
          return actualCompanyId;
        }
      } else {
        // It's already a real company ID
        return contactEntry.companyId;
      }
    }

    // Fallback to looking up by company name
    if (contactEntry.data.companyName) {
      const companyKey = importUtils.normalizeCompanyName(contactEntry.data.companyName);
      const company = companiesByName.get(companyKey);
      return company?.id;
    }

    return undefined;
  }
}
