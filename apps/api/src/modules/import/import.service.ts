import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CompanyImportData,
  ContactImportData,
  ImportEntry,
  ImportExecuteRequest,
  ImportExecuteResponse,
  ImportPreviewResponse,
  ImportProcessRequest,
  companyImportDataSchema,
  contactImportDataSchema,
  type DuplicateEmailError,
  type DuplicateNameError,
  type GetContactResponse,
  type ImportFieldMapping,
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
    const { data: csvData, truncated, totalRows } = await importUtils.parseCSV(csvFile);
    const dataRows = csvData.slice(1); // Skip header row

    if (dataRows.length === 0) {
      throw new BadRequestException('CSV data is empty');
    }

    // Initialize lookup maps
    const existingCompanies = await this.initializeCompanyMaps(dataRows, request.fieldMappings);

    // Process all rows and collect import entries
    const { companies, contacts } = await this.processAllRows(dataRows, request, existingCompanies);

    const duplicateEmailErrors = await this.validateUniqueEmails(companies, contacts);
    const duplicateNameErrors = await this.validateUniqueNames(companies);

    return {
      companies,
      contacts,
      truncated,
      totalRows,
      duplicateEmailErrors,
      duplicateNameErrors,
    };
  }

  private async validateUniqueEmails(
    companies: ImportEntry<CompanyImportData>[],
    contacts: ImportEntry<ContactImportData>[]
  ): Promise<DuplicateEmailError[]> {
    const companyEmailMap = this.collectEmailsFromEntries(companies);
    const contactEmailMap = this.collectEmailsFromEntries(contacts);

    // Fetch existing entities with these emails
    const existingCompanies = await this.companyService.findCompaniesByEmails([...companyEmailMap.keys()]);
    const existingContacts = await this.contactService.findContactsByEmails([...contactEmailMap.keys()]);

    return [
      ...this.findDuplicatesInEmailMap(companyEmailMap, 'company', existingCompanies),
      ...this.findDuplicatesInEmailMap(contactEmailMap, 'contact', existingContacts),
    ];
  }

  private collectEmailsFromEntries<T extends ImportEntry<ContactImportData> | ImportEntry<CompanyImportData>>(
    entries: T[]
  ): Map<string, number[]> {
    const emailMap = new Map<string, number[]>();

    for (const [index, entry] of entries.entries()) {
      if (entry.existingId) continue;
      if (!entry.data.email) continue;

      const normalizedEmail = entry.data.email.toLowerCase().trim();
      if (normalizedEmail) {
        if (!emailMap.has(normalizedEmail)) {
          emailMap.set(normalizedEmail, []);
        }
        emailMap.get(normalizedEmail)!.push(index + 1);
      }
    }

    return emailMap;
  }

  private findDuplicatesInEmailMap(
    emailMap: Map<string, number[]>,
    type: 'company' | 'contact',
    existingEntities?: Map<string, any>
  ): DuplicateEmailError[] {
    const duplicateErrors: DuplicateEmailError[] = [];

    for (const [email, rows] of emailMap.entries()) {
      // Check if email exists in database
      const existingEntity = existingEntities?.get(email);

      if (existingEntity) {
        // Email exists in database, always report as duplicate
        const entityName =
          type === 'contact' ? `${existingEntity.firstName} ${existingEntity.lastName}` : existingEntity.name;

        duplicateErrors.push({
          email,
          type,
          rows,
          existingEntity: {
            id: existingEntity.id,
            name: entityName,
          },
        });
      } else if (rows.length > 1) {
        // Email appears multiple times in import data
        duplicateErrors.push({ email, type, rows });
      }
    }

    return duplicateErrors;
  }

  private async initializeCompanyMaps(
    dataRows: string[][],
    fieldMappings: any
  ): Promise<Map<string, { id: number; name: string }>> {
    const companyNamesToLookup = this.collectCompanyNames(dataRows, fieldMappings);
    const existingCompaniesByName = await this.fetchCompaniesByName(companyNamesToLookup);

    return existingCompaniesByName;
  }

  private collectCompanyNames(dataRows: string[][], fieldMappings: any): Set<string> {
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

  private collectContactEmails(dataRows: string[][], fieldMappings: any): Set<string> {
    const contactEmails = new Set<string>();

    for (const row of dataRows) {
      const { contactData } = this.mapRowToData(row, fieldMappings);

      if (contactData?.email) {
        contactEmails.add(contactData.email);
      }
    }

    return contactEmails;
  }

  private async processAllRows(
    dataRows: string[][],
    request: ImportProcessRequest,
    existingCompanies: Map<string, { id: number; name: string }>
  ): Promise<{ companies: ImportEntry<CompanyImportData>[]; contacts: ImportEntry<ContactImportData>[] }> {
    const companies: ImportEntry<CompanyImportData>[] = [];
    const contacts: ImportEntry<ContactImportData>[] = [];

    // Pre-fetch all contacts by emails to avoid N+1 queries
    const contactEmailsToLookup = this.collectContactEmails(dataRows, request.fieldMappings);
    const existingContactsByEmail = await this.contactService.findContactsByEmails([...contactEmailsToLookup]);

    for (const row of dataRows) {
      const { companyData, contactData } = this.mapRowToData(row, request.fieldMappings);

      let currentRowCompanyData: CompanyImportData | undefined;

      if (companyData && request.importType !== 'contacts') {
        this.processCompanyEntry(companyData, companies, existingCompanies);
        currentRowCompanyData = companyData;
      }

      if (contactData && request.importType !== 'companies') {
        this.processContactEntry(
          contactData,
          contacts,
          existingCompanies,
          currentRowCompanyData,
          existingContactsByEmail
        );
      }
    }

    return { companies, contacts };
  }

  private processCompanyEntry(
    companyData: CompanyImportData,
    companies: ImportEntry<CompanyImportData>[],
    existingCompanies: Map<string, { id: number; name: string }>
  ): void {
    const companyNameLower = importUtils.normalizeCompanyName(companyData.name);
    const existingCompany = existingCompanies.get(companyNameLower);

    const existingEntry = companies.find(
      entry => importUtils.normalizeCompanyName(entry.data.name) === companyNameLower
    );

    if (existingEntry) {
      // Merge the company data with existing entry
      const mergedData = { ...existingEntry.data, ...companyData };

      // Remove falsy values from merged data
      importUtils.removeFalsyValues(mergedData);

      // Update the existing entry
      existingEntry.data = mergedData;
    } else {
      // Add new company entry
      importUtils.removeFalsyValues(companyData);

      companies.push({
        data: companyData,
        action: existingCompany ? 'update' : 'create',
        existingId: existingCompany?.id,
        selected: true,
      });
    }
  }

  private processContactEntry(
    contactData: ContactImportData,
    contacts: ImportEntry<ContactImportData>[],
    existingCompanies: Map<string, { id: number; name: string }>,
    currentRowCompanyData?: CompanyImportData,
    existingContactsByEmail?: Map<string, GetContactResponse>
  ) {
    const existingContact = existingContactsByEmail?.get(contactData.email);
    const { matchedCompany, companyId } = this.resolveContactCompany(
      contactData,
      existingCompanies,
      currentRowCompanyData
    );

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
    existingCompanies: Map<string, { id: number; name: string }>,
    currentRowCompanyData?: CompanyImportData
  ): { matchedCompany?: { id: number; name: string }; companyId?: number } {
    // Priority 1: Use company from the same row
    if (currentRowCompanyData) {
      const companyNameLower = importUtils.normalizeCompanyName(currentRowCompanyData.name);
      const existingCompany = existingCompanies.get(companyNameLower);

      if (existingCompany) {
        // Company exists, use its ID
        return {
          matchedCompany: { id: existingCompany.id, name: existingCompany.name },
          companyId: existingCompany.id,
        };
      } else {
        // Company will be created, use a placeholder that indicates same-row company
        return {
          matchedCompany: { id: -1, name: currentRowCompanyData.name },
          companyId: -1, // Placeholder for same-row new company
        };
      }
    }

    // Priority 2: Look up company by name
    if (contactData.companyName) {
      const companyKey = importUtils.normalizeCompanyName(contactData.companyName);
      const existingCompany = existingCompanies.get(companyKey);
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
      await this.prisma.$transaction(
        async tx => {
          // Keep track of created companies for contact processing
          const createdCompanies = new Map<string, { id: number; name: string }>();

          await this.processCompaniesImportBatch(companies, stats, errors, createdCompanies, tx);
          await this.processContactsImportBatch(contacts, stats, errors, createdCompanies, tx);
        },
        {
          maxWait: 20 * 1000,
          timeout: 30 * 1000,
        }
      );
    } catch (error) {
      errors.push({
        row: 0,
        field: 'transaction',
        message: `Database transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
    let companyData: string[][] = [];
    let contactData: string[][] = [];

    if (companyCsvFile) {
      const companyResult = await importUtils.parseCSV(companyCsvFile);
      companyData = companyResult.data;
    }

    if (contactCsvFile) {
      const contactResult = await importUtils.parseCSV(contactCsvFile);
      contactData = contactResult.data;
    }

    // Convert CSV data to ImportExecuteRequest format
    const companies = importUtils.convertCsvToImportEntries(
      companyData,
      request.fieldMappings.companyMappings as ImportFieldMapping<CompanyImportData>[],
      request.skippedCompanyRows
    );
    const contacts = importUtils.convertCsvToImportEntries(
      contactData,
      request.fieldMappings.contactMappings as ImportFieldMapping<ContactImportData>[],
      request.skippedContactRows
    );

    // Use the existing executeImport method with the converted data
    return this.executeImport({ companies, contacts });
  }

  private mapRowToData(
    row: string[],
    fieldMappings: any
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

    // Validate and parse data, skipping invalid entries
    let validCompanyData: CompanyImportData | undefined;
    let validContactData: ContactImportData | undefined;

    if (Object.keys(companyData).length > 0) {
      const companyResult = companyImportDataSchema.safeParse(companyData);
      if (companyResult.success) {
        validCompanyData = companyResult.data;
      }
      // Skip invalid company data - do not throw error
    }

    if (Object.keys(contactData).length > 0) {
      const contactResult = contactImportDataSchema.safeParse(contactData);
      if (contactResult.success) {
        validContactData = contactResult.data;
      }
      // Skip invalid contact data - do not throw error
    }

    return {
      companyData: validCompanyData,
      contactData: validContactData,
    };
  }

  private async fetchCompaniesByName(companyNamesToLookup: Set<string>) {
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
    createdCompanies: Map<string, { id: number; name: string }>,
    tx: Prisma.TransactionClient
  ) {
    if (companies.length === 0) return;

    const { companiesToCreate, companiesToUpdate } = importUtils.separateCompaniesForBatch(companies);

    try {
      await this.batchCreateCompanies(companiesToCreate, stats, createdCompanies, tx);
      await this.batchUpdateCompanies(companiesToUpdate, stats, createdCompanies, tx);
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
    createdCompanies: Map<string, { id: number; name: string }>,
    tx: Prisma.TransactionClient
  ) {
    if (companiesToCreate.length === 0) return;

    const createData = companiesToCreate.map(entry => entry.data);
    const createdCompanyList = await this.companyService.createManyCompanies(createData, tx);

    // Map created companies by name for later lookup
    for (const [index, createdCompany] of createdCompanyList.entries()) {
      const originalEntry = companiesToCreate[index];
      const companyNameLower = importUtils.normalizeCompanyName(originalEntry.data.name);
      createdCompanies.set(companyNameLower, {
        id: createdCompany.id,
        name: createdCompany.name,
      });
    }

    stats.companies += createdCompanyList.length;
  }

  private async batchUpdateCompanies(
    companiesToUpdate: ImportEntry<CompanyImportData>[],
    stats: ImportExecuteResponse['stats'],
    createdCompanies: Map<string, { id: number; name: string }>,
    tx: Prisma.TransactionClient
  ) {
    if (companiesToUpdate.length === 0) return;

    // Prepare updates for the company service
    const updates = companiesToUpdate
      .filter(c => c.existingId)
      .map(c => ({
        id: c.existingId!,
        data: c.data,
      }));

    await this.companyService.bulkUpdateCompanies(updates, tx);

    // Update the lookup map with updated companies
    for (const entry of companiesToUpdate) {
      if (entry.existingId) {
        const companyNameLower = importUtils.normalizeCompanyName(entry.data.name);
        createdCompanies.set(companyNameLower, {
          id: entry.existingId,
          name: entry.data.name,
        });
      }
    }

    stats.companies += updates.length;
  }

  private async processContactsImportBatch(
    contacts: ImportEntry<ContactImportData>[],
    stats: ImportExecuteResponse['stats'],
    errors: ImportExecuteResponse['errors'],
    createdCompanies: Map<string, { id: number; name: string }>,
    tx: Prisma.TransactionClient
  ) {
    if (contacts.length === 0) return;

    // Pre-fetch all companies to avoid N+1 queries
    const companiesByName = await this.fetchCompaniesByName(this.collectCompanyNamesFromContacts(contacts));

    // Merge the newly created/updated companies with the existing ones
    for (const [name, company] of createdCompanies.entries()) {
      companiesByName.set(name, company);
    }

    const { contactsToCreate, contactsToUpdate } = importUtils.separateContactsForBatch(contacts);

    try {
      await this.batchCreateContacts(contactsToCreate, stats, companiesByName, tx);
      await this.batchUpdateContacts(contactsToUpdate, stats, companiesByName, tx);
    } catch (error) {
      stats.errors++;
      errors?.push({
        row: stats.contacts + stats.errors,
        field: 'contact',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private collectCompanyNamesFromContacts(contacts: ImportEntry<ContactImportData>[]): Set<string> {
    // Collect all unique company names that need to be looked up
    const companyNamesToLookup = new Set<string>();

    for (const contactEntry of contacts) {
      if (!contactEntry.companyId && contactEntry.data.companyName) {
        companyNamesToLookup.add(contactEntry.data.companyName.trim());
      }
    }

    return companyNamesToLookup;
  }

  private async batchCreateContacts(
    contactsToCreate: ImportEntry<ContactImportData>[],
    stats: ImportExecuteResponse['stats'],
    companiesByName: Map<string, { id: number; name: string }>,
    tx: Prisma.TransactionClient
  ) {
    if (contactsToCreate.length === 0) return;

    const createData = contactsToCreate.map(contactEntry => {
      const companyId = this.resolveCompanyId(contactEntry, companiesByName);
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
    tx: Prisma.TransactionClient
  ) {
    if (contactsToUpdate.length === 0) return;

    // Prepare updates for the contact service
    const updates = contactsToUpdate
      .filter(c => c.existingId)
      .map(contactEntry => {
        const companyId = this.resolveCompanyId(contactEntry, companiesByName);
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

  private resolveCompanyId(
    contactEntry: ImportEntry<ContactImportData>,
    companiesByName: Map<string, { id: number; name: string }>
  ): number | undefined {
    // Handle same-row company placeholder
    if (contactEntry.companyId === -1 && contactEntry.matchedCompany) {
      // This is a same-row company, look it up in the created companies map
      const companyKey = importUtils.normalizeCompanyName(contactEntry.matchedCompany.name);
      const company = companiesByName.get(companyKey);
      return company?.id;
    }

    // First check if we have a real companyId from the contact entry
    if (contactEntry.companyId && contactEntry.companyId > 0) {
      return contactEntry.companyId;
    }

    // Fallback to looking up by company name
    if (contactEntry.data.companyName) {
      const companyKey = importUtils.normalizeCompanyName(contactEntry.data.companyName);
      const company = companiesByName.get(companyKey);
      return company?.id;
    }

    return undefined;
  }

  private async validateUniqueNames(companies: ImportEntry<CompanyImportData>[]): Promise<DuplicateNameError[]> {
    const companyNameMap = this.collectNamesFromEntries(companies);

    // Fetch existing companies with these names
    const existingCompaniesArray = await this.companyService.findCompaniesByNames([...companyNameMap.keys()]);

    // Convert to map for efficient lookup
    const existingCompanies = new Map<string, any>();
    for (const company of existingCompaniesArray) {
      existingCompanies.set(company.name.toLowerCase(), company);
    }

    return this.findDuplicatesInNameMap(companyNameMap, existingCompanies, companies);
  }

  private collectNamesFromEntries(entries: ImportEntry<CompanyImportData>[]): Map<string, number[]> {
    const nameMap = new Map<string, number[]>();

    for (const [index, entry] of entries.entries()) {
      if (entry.existingId) continue;
      if (!entry.data.name) continue;

      const normalizedName = entry.data.name.toLowerCase().trim();
      if (normalizedName) {
        if (!nameMap.has(normalizedName)) {
          nameMap.set(normalizedName, []);
        }
        nameMap.get(normalizedName)!.push(index + 1);
      }
    }

    return nameMap;
  }

  private findDuplicatesInNameMap(
    nameMap: Map<string, number[]>,
    existingEntities: Map<string, any>,
    companies: ImportEntry<CompanyImportData>[]
  ): DuplicateNameError[] {
    const duplicateErrors: DuplicateNameError[] = [];

    for (const [name, rows] of nameMap.entries()) {
      // Check if name exists in database
      const existingEntity = existingEntities.get(name);

      if (existingEntity) {
        // Check if any of the companies with this name are intended to be created (not updated)
        const hasCreateAction = companies.some(
          company => company.data.name.toLowerCase() === name && company.action === 'create'
        );

        // Only report as duplicate if there are companies intended to be created with existing names
        if (hasCreateAction) {
          duplicateErrors.push({
            name,
            type: 'company',
            rows,
            existingEntity: {
              id: existingEntity.id,
              name: existingEntity.name,
            },
          });
        }
      } else if (rows.length > 1) {
        // Name appears multiple times in import data
        duplicateErrors.push({ name, type: 'company', rows });
      }
    }

    return duplicateErrors;
  }
}
