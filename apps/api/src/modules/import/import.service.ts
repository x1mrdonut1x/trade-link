import { Injectable, BadRequestException } from '@nestjs/common';
import {
  ImportProcessRequest,
  ImportExecuteRequest,
  ImportPreviewResponse,
  ImportExecuteResponse,
  ImportEntry,
  CompanyImportData,
  ContactImportData,
  ImportFieldMappings,
} from '@tradelink/shared';
import Papa from 'papaparse';

import { PrismaService } from '../prisma/prisma.service';
import { CompanyService } from '../company/company.service';
import { ContactService } from '../contact/contact.service';

@Injectable()
export class ImportService {
  constructor(
    private prisma: PrismaService,
    private companyService: CompanyService,
    private contactService: ContactService,
  ) {}

  async processImport(
    request: ImportProcessRequest,
    csvFile: any,
  ): Promise<ImportPreviewResponse> {
    const { fieldMappings, importType } = request;

    if (!csvFile) {
      throw new BadRequestException('CSV file is required');
    }

    // Parse CSV file
    const csvData = await this.parseCSV(csvFile);

    if (csvData.length === 0) {
      throw new BadRequestException('CSV data is empty');
    }

    // Skip header row
    const dataRows = csvData.slice(1);

    const companies: ImportEntry<CompanyImportData>[] = [];
    const contacts: ImportEntry<ContactImportData>[] = [];

    // Collect all company names that need to be looked up for contacts
    const companyNamesToLookup = new Set<string>();

    // First pass: collect all mapped data and company names
    const mappedRows = dataRows.map((row) => {
      const { companyData, contactData } = this.mapRowToData(
        row,
        fieldMappings,
      );
      if (contactData.companyName && contactData.companyName.trim()) {
        companyNamesToLookup.add(contactData.companyName.trim().toLowerCase());
      }
      // Also add company names from company data
      if (companyData.name && companyData.name.trim()) {
        companyNamesToLookup.add(companyData.name.trim().toLowerCase());
      }
      return { companyData, contactData };
    });

    // Fetch all companies by name in a single query
    const companiesByName =
      await this.fetchCompaniesByNameForPreview(companyNamesToLookup);

    // Create a map for temporary company IDs (starting from -1 and going down)
    const tempCompanyIdCounter = { value: -1 };
    const tempCompaniesByName = new Map<
      string,
      { id: number; name: string; isTemp: boolean }
    >();

    // Process each row
    for (const [index, { companyData, contactData }] of mappedRows.entries()) {
      try {
        await this.processDataRow(
          companyData,
          contactData,
          importType,
          companies,
          contacts,
          companiesByName,
          tempCompaniesByName,
          tempCompanyIdCounter,
        );
      } catch (error) {
        console.error(`Error processing row ${index + 1}:`, error);
        // Continue processing other rows
      }
    }

    return {
      companies,
      contacts,
    };
  }

  private async fetchCompaniesByNameForPreview(
    companyNamesToLookup: Set<string>,
  ): Promise<Map<string, { id: number; name: string }>> {
    const companiesByName = new Map<string, { id: number; name: string }>();

    if (companyNamesToLookup.size > 0) {
      const companies = await this.prisma.company.findMany({
        where: {
          name: {
            in: [...companyNamesToLookup],
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      // Create a case-insensitive lookup map
      for (const company of companies) {
        companiesByName.set(company.name.toLowerCase(), company);
      }
    }

    return companiesByName;
  }

  async executeImport(
    request: ImportExecuteRequest,
  ): Promise<ImportExecuteResponse> {
    const { companies, contacts } = request;

    const stats = {
      totalRecords: companies.length + contacts.length,
      companies: 0,
      contacts: 0,
      errors: 0,
    };

    const errors: Array<{ row: number; field: string; message: string }> = [];

    // Process companies first and track temporary ID mapping
    const tempCompanyIdMap = new Map<number, number>();
    await this.processCompaniesImport(
      companies,
      stats,
      errors,
      tempCompanyIdMap,
    );

    // Process contacts with the company ID mapping
    await this.processContactsImport(contacts, stats, errors, tempCompanyIdMap);

    return {
      success: stats.errors === 0,
      stats,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async generateTemplate(type: string): Promise<string> {
    const companyHeaders = [
      'name',
      'email',
      'phonePrefix',
      'phoneNumber',
      'description',
      'website',
      'size',
      'address',
      'city',
      'country',
      'postCode',
    ];

    const contactHeaders = [
      'firstName',
      'lastName',
      'email',
      'jobTitle',
      'phonePrefix',
      'phoneNumber',
      'address',
      'city',
      'country',
      'postCode',
      'companyName',
    ];

    let headers: string[];
    switch (type) {
      case 'companies': {
        headers = companyHeaders;
        break;
      }
      case 'contacts': {
        headers = contactHeaders;
        break;
      }
      case 'mixed': {
        headers = [...new Set([...companyHeaders, ...contactHeaders])];
        break;
      }
      default: {
        throw new BadRequestException('Invalid template type');
      }
    }

    // Generate CSV content
    return headers.join(',') + '\n';
  }

  private async processDataRow(
    companyData: Record<string, string>,
    contactData: Record<string, string>,
    importType: string,
    companies: ImportEntry<CompanyImportData>[],
    contacts: ImportEntry<ContactImportData>[],
    companiesByName: Map<string, { id: number; name: string }>,
    tempCompaniesByName: Map<
      string,
      { id: number; name: string; isTemp: boolean }
    >,
    tempCompanyIdCounter: { value: number },
  ): Promise<void> {
    // Determine if this row should create a company, contact, or both
    const shouldCreateCompany = this.shouldCreateCompany(
      companyData,
      importType,
    );
    const shouldCreateContact = this.shouldCreateContact(
      contactData,
      importType,
    );

    let currentRowCompanyId: number | undefined;

    if (shouldCreateCompany) {
      currentRowCompanyId = await this.processCompanyData(
        companyData,
        companies,
        tempCompaniesByName,
        tempCompanyIdCounter,
      );
    }

    if (shouldCreateContact) {
      await this.processContactData(
        contactData,
        contacts,
        companiesByName,
        tempCompaniesByName,
        currentRowCompanyId,
      );
    }
  }

  private async processCompanyData(
    mappedData: Record<string, string>,
    companies: ImportEntry<CompanyImportData>[],
    tempCompaniesByName: Map<
      string,
      { id: number; name: string; isTemp: boolean }
    >,
    tempCompanyIdCounter: { value: number },
  ): Promise<number | undefined> {
    const companyData = this.extractCompanyData(mappedData);

    // Validate that we have a company name
    if (companyData.name && companyData.name.trim()) {
      const companyNameLower = companyData.name.trim().toLowerCase();

      // Check if company already exists
      const existingCompany = await this.findExistingCompany(companyData);

      let companyId: number;

      if (existingCompany) {
        companyId = existingCompany.id;
      } else {
        // Assign a temporary ID for new companies
        companyId = tempCompanyIdCounter.value--;
        tempCompaniesByName.set(companyNameLower, {
          id: companyId,
          name: companyData.name.trim(),
          isTemp: true,
        });
      }

      this.removeFalsyValues(companyData);

      companies.push({
        data: companyData,
        action: existingCompany ? 'update' : 'create',
        existingId: existingCompany?.id,
        selected: true,
      });

      return companyId;
    }

    return undefined;
  }

  private async processContactData(
    mappedData: Record<string, string>,
    contacts: ImportEntry<ContactImportData>[],
    companiesByName: Map<string, { id: number; name: string }>,
    tempCompaniesByName: Map<
      string,
      { id: number; name: string; isTemp: boolean }
    >,
    currentRowCompanyId: number | undefined,
  ): Promise<void> {
    const contactData = this.extractContactData(mappedData);

    // Check if contact already exists
    const existingContact = await this.findExistingContact(contactData);

    // Try to match with company using the available sources
    let matchedCompany;
    let companyId: number | undefined;

    // First priority: use company from the same row (if any)
    if (currentRowCompanyId) {
      companyId = currentRowCompanyId;
      // Find the company name for this temp ID
      for (const [, company] of tempCompaniesByName.entries()) {
        if (company.id === currentRowCompanyId) {
          matchedCompany = {
            id: company.id,
            name: company.name,
          };
          break;
        }
      }
    }

    // Second priority: look up company by name if no same-row company
    if (!matchedCompany && contactData.companyName) {
      const companyKey = contactData.companyName.trim().toLowerCase();

      // Check temporary companies first
      const tempCompany = tempCompaniesByName.get(companyKey);
      if (tempCompany) {
        matchedCompany = {
          id: tempCompany.id,
          name: tempCompany.name,
        };
        companyId = tempCompany.id;
      } else {
        // Check existing companies
        const existingCompany = companiesByName.get(companyKey);
        if (existingCompany) {
          matchedCompany = {
            id: existingCompany.id,
            name: existingCompany.name,
          };
          companyId = existingCompany.id;
        }
      }
    }

    this.removeFalsyValues(contactData);
    contacts.push({
      data: contactData,
      action: existingContact ? 'update' : 'create',
      existingId: existingContact?.id,
      selected: true,
      matchedCompany,
      companyId,
    });
  }

  private async processCompaniesImport(
    companies: ImportExecuteRequest['companies'],
    stats: { companies: number; errors: number },
    errors: Array<{ row: number; field: string; message: string }>,
    tempCompanyIdMap: Map<number, number>,
  ): Promise<void> {
    // Create a mapping from company name to created company ID
    const companyNameToIdMap = new Map<string, number>();

    for (const companyEntry of companies) {
      try {
        let companyId: number | undefined;

        if (companyEntry.action === 'create') {
          const createdCompany = await this.companyService.createCompany(
            companyEntry.data,
          );
          companyId = createdCompany.id;
          // Store the mapping from company name to actual ID
          companyNameToIdMap.set(
            companyEntry.data.name.trim().toLowerCase(),
            companyId,
          );
        } else if (
          companyEntry.action === 'update' &&
          companyEntry.existingId
        ) {
          const updatedCompany = await this.companyService.updateCompany(
            companyEntry.existingId,
            companyEntry.data,
          );
          companyId = updatedCompany.id;
          companyNameToIdMap.set(
            companyEntry.data.name.trim().toLowerCase(),
            companyId,
          );
        }

        stats.companies++;
      } catch (error) {
        stats.errors++;
        errors.push({
          row: stats.companies + stats.errors,
          field: 'company',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Store the company name to ID mapping for use in contact processing
    (tempCompanyIdMap as any).companyNameToIdMap = companyNameToIdMap;
  }

  private async processContactsImport(
    contacts: ImportExecuteRequest['contacts'],
    stats: { contacts: number; errors: number },
    errors: Array<{ row: number; field: string; message: string }>,
    tempCompanyIdMap: Map<number, number>,
  ): Promise<void> {
    // Pre-fetch all companies to avoid N+1 queries
    const companiesByName = await this.fetchCompaniesByName(contacts);

    // Get the company name to ID mapping from the companies import
    const companyNameToIdMap =
      ((tempCompanyIdMap as any).companyNameToIdMap as Map<string, number>) ||
      new Map();

    // Merge the newly created companies with the existing ones
    for (const [name, company] of companyNameToIdMap.entries()) {
      companiesByName.set(name, { id: company, name });
    }

    // Process each contact
    for (const contactEntry of contacts) {
      try {
        await this.processContactEntry(
          contactEntry,
          companiesByName,
          tempCompanyIdMap,
        );
        stats.contacts++;
      } catch (error) {
        stats.errors++;
        errors.push({
          row: stats.contacts + stats.errors,
          field: 'contact',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }

  private async fetchCompaniesByName(
    contacts: ImportExecuteRequest['contacts'],
  ): Promise<Map<string, { id: number; name: string }>> {
    // Collect all unique company names that need to be looked up
    const companyNamesToLookup = new Set<string>();

    for (const contactEntry of contacts) {
      if (!contactEntry.companyId && contactEntry.data.companyName) {
        companyNamesToLookup.add(contactEntry.data.companyName.trim());
      }
    }

    // Fetch all companies by name in a single query
    const companiesByName = new Map<string, { id: number; name: string }>();

    if (companyNamesToLookup.size > 0) {
      const companies = await this.prisma.company.findMany({
        where: {
          name: {
            in: [...companyNamesToLookup],
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      // Create a case-insensitive lookup map
      for (const company of companies) {
        companiesByName.set(company.name.toLowerCase(), company);
      }
    }

    return companiesByName;
  }

  private async processContactEntry(
    contactEntry: ImportExecuteRequest['contacts'][0],
    companiesByName: Map<string, { id: number; name: string }>,
    tempCompanyIdMap: Map<number, number>,
  ): Promise<void> {
    // Determine the companyId to use
    const companyId = this.resolveCompanyId(
      contactEntry,
      companiesByName,
      tempCompanyIdMap,
    );

    // Remove companyName from contact data since it's not a valid field for contact creation
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { companyName, ...contactDataWithoutCompanyName } = contactEntry.data;

    const contactData = {
      ...contactDataWithoutCompanyName,
      companyId,
    };

    if (contactEntry.action === 'create') {
      await this.contactService.createContact(contactData);
    } else if (contactEntry.action === 'update' && contactEntry.existingId) {
      await this.contactService.updateContact(
        contactEntry.existingId,
        contactData,
      );
    }
  }

  private resolveCompanyId(
    contactEntry: ImportExecuteRequest['contacts'][0],
    companiesByName: Map<string, { id: number; name: string }>,
    tempCompanyIdMap: Map<number, number>,
  ): number | undefined {
    // First check if we have a companyId from the contact entry
    if (contactEntry.companyId) {
      // If it's a temporary ID (negative), map it to the actual ID
      if (contactEntry.companyId < 0) {
        const actualCompanyId = tempCompanyIdMap.get(contactEntry.companyId);
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
      const company = companiesByName.get(
        contactEntry.data.companyName.trim().toLowerCase(),
      );
      return company?.id;
    }

    return undefined;
  }

  private mapRowToData(
    row: string[],
    fieldMappings: ImportFieldMappings,
  ): {
    companyData: Record<string, string>;
    contactData: Record<string, string>;
  } {
    const companyData: Record<string, string> = {};
    const contactData: Record<string, string> = {};

    // Map company fields
    for (const mapping of fieldMappings.companyMappings) {
      if (
        mapping.csvColumnIndex < row.length &&
        row[mapping.csvColumnIndex] != null
      ) {
        companyData[mapping.targetField] = row[mapping.csvColumnIndex].trim();
      }
    }

    // Map contact fields
    for (const mapping of fieldMappings.contactMappings) {
      if (
        mapping.csvColumnIndex < row.length &&
        row[mapping.csvColumnIndex] != null
      ) {
        contactData[mapping.targetField] = row[mapping.csvColumnIndex].trim();
      }
    }

    return { companyData, contactData };
  }

  private shouldCreateCompany(
    mappedData: Record<string, string>,
    importType: string,
  ): boolean {
    if (importType === 'contacts') return false;

    // For companies import type, check if we have a company name field
    if (importType === 'companies') {
      return !!(mappedData.name && mappedData.name.trim());
    }

    // For mixed import type, check if we have either name or companyName field
    if (importType === 'mixed') {
      return !!(
        (mappedData.name && mappedData.name.trim()) ||
        (mappedData.companyName && mappedData.companyName.trim())
      );
    }

    return false;
  }

  private shouldCreateContact(
    mappedData: Record<string, string>,
    importType: string,
  ): boolean {
    if (importType === 'companies') return false;

    // Check if we have the required contact fields
    const hasRequiredFields = !!(
      mappedData.firstName &&
      mappedData.firstName.trim() &&
      mappedData.lastName &&
      mappedData.lastName.trim() &&
      mappedData.email &&
      mappedData.email.trim()
    );

    return hasRequiredFields;
  }

  private removeFalsyValues(myObj: Record<string, unknown>) {
    for (const k in myObj) {
      if (
        Object.prototype.hasOwnProperty.call(myObj, k) &&
        myObj[k] === false
      ) {
        delete myObj[k];
      }
    }
  }

  private extractCompanyData(
    mappedData: Record<string, string>,
  ): CompanyImportData {
    // Use either 'name' field or 'companyName' field for company name
    const companyName = mappedData.name || mappedData.companyName || '';

    return {
      name: companyName,
      email: mappedData.email,
      phonePrefix: mappedData.phonePrefix,
      phoneNumber: mappedData.phoneNumber,
      description: mappedData.description,
      website: mappedData.website,
      size: mappedData['size'],
      address: mappedData.address,
      city: mappedData.city,
      country: mappedData.country,
      postCode: mappedData.postCode,
    };
  }

  private extractContactData(
    mappedData: Record<string, string>,
  ): ContactImportData {
    return {
      firstName: mappedData.firstName,
      lastName: mappedData.lastName,
      email: mappedData.email,
      jobTitle: mappedData.jobTitle,
      phonePrefix: mappedData.phonePrefix,
      phoneNumber: mappedData.phoneNumber,
      address: mappedData.address,
      city: mappedData.city,
      country: mappedData.country,
      postCode: mappedData.postCode,
      companyName: mappedData.companyName,
    };
  }

  private async findExistingCompany(companyData: CompanyImportData) {
    return await this.prisma.company.findFirst({
      where: {
        name: {
          equals: companyData.name,
          mode: 'insensitive',
        },
      },
    });
  }

  private async findExistingContact(contactData: ContactImportData) {
    return await this.prisma.contact.findFirst({
      where: {
        email: contactData.email,
      },
    });
  }

  private async findCompanyByName(companyName: string) {
    return await this.prisma.company.findFirst({
      where: {
        name: {
          equals: companyName,
          mode: 'insensitive',
        },
      },
    });
  }

  private async parseCSV(csvFile: any): Promise<string[][]> {
    return new Promise((resolve, reject) => {
      const fileContent = csvFile.buffer.toString('utf8');

      Papa.parse(fileContent, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(
              new BadRequestException(
                `CSV parsing errors: ${results.errors
                  .map((e) => e.message)
                  .join(', ')}`,
              ),
            );
            return;
          }

          const csvData = results.data as string[][];
          resolve(csvData);
        },
        error: (error) => {
          reject(
            new BadRequestException(`Failed to parse CSV: ${error.message}`),
          );
        },
      });
    });
  }
}
