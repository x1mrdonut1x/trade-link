import { ImportFieldMappings } from '@tradelink/shared';
import { createAuthenticatedUser } from '../../helpers/auth/auth.helper';
import { createCompany, getCompany } from '../../helpers/company/company.helper';
import { createContact, getContact } from '../../helpers/contact/contact.helper';
import { executeImport, importFixtures, processImport } from '../../helpers/import/import.helper';
import { resetDatabase, setTestAuthToken } from '../../setupFilesAfterEnv';

describe('Import Controller (e2e)', () => {
  let authToken: string;

  beforeEach(async () => {
    await resetDatabase();
    authToken = await createAuthenticatedUser();
    setTestAuthToken(authToken);
  });

  describe('POST /import/process', () => {
    it('should process valid CSV data with mixed import type', async () => {
      const csvData = `Company Name,First Name,Last Name,Email,Job Title
Acme Corp,John,Doe,john.doe@example.com,Software Engineer
Tech Solutions,Jane,Smith,jane.smith@example.com,Project Manager`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [{ csvColumnIndex: 0, targetField: 'name' }],
        contactMappings: [
          { csvColumnIndex: 1, targetField: 'firstName' },
          { csvColumnIndex: 2, targetField: 'lastName' },
          { csvColumnIndex: 3, targetField: 'email' },
          { csvColumnIndex: 4, targetField: 'jobTitle' },
        ],
      };

      const response = await processImport(authToken, csvData, fieldMappings, 'mixed');

      expect(response.companies).toBeDefined();
      expect(response.contacts).toBeDefined();
      expect(response.companies.length).toBe(2);
      expect(response.contacts.length).toBe(2);

      // Verify company data
      expect(response.companies[0].data.name).toBe('Acme Corp');
      expect(response.companies[0].action).toBe('create');
      expect(response.companies[0].selected).toBe(true);

      // Verify contact data
      expect(response.contacts[0].data.firstName).toBe('John');
      expect(response.contacts[0].data.lastName).toBe('Doe');
      expect(response.contacts[0].data.email).toBe('john.doe@example.com');
      expect(response.contacts[0].data.jobTitle).toBe('Software Engineer');
      expect(response.contacts[0].action).toBe('create');
      expect(response.contacts[0].selected).toBe(true);
    });

    it('should process companies only import type', async () => {
      const csvData = `Company Name,Email,Website,Size
Acme Corp,info@acme.com,https://acme.com,Medium
Tech Solutions,contact@tech.com,https://techsolutions.com,Large`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [
          { csvColumnIndex: 0, targetField: 'name' },
          { csvColumnIndex: 1, targetField: 'email' },
          { csvColumnIndex: 2, targetField: 'website' },
          { csvColumnIndex: 3, targetField: 'size' },
        ],
        contactMappings: [],
      };

      const response = await processImport(authToken, csvData, fieldMappings, 'companies');

      expect(response.companies.length).toBe(2);
      expect(response.contacts.length).toBe(0);
      expect(response.companies[0].data.name).toBe('Acme Corp');
      expect(response.companies[0].data.email).toBe('info@acme.com');
      expect(response.companies[0].data.website).toBe('https://acme.com');
      expect(response.companies[0].data.size).toBe('Medium');
    });

    it('should process contacts only import type', async () => {
      const csvData = `First Name,Last Name,Email,Job Title,Phone
John,Doe,john.doe@example.com,Software Engineer,555-0123
Jane,Smith,jane.smith@example.com,Project Manager,555-0124`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [],
        contactMappings: [
          { csvColumnIndex: 0, targetField: 'firstName' },
          { csvColumnIndex: 1, targetField: 'lastName' },
          { csvColumnIndex: 2, targetField: 'email' },
          { csvColumnIndex: 3, targetField: 'jobTitle' },
          { csvColumnIndex: 4, targetField: 'phoneNumber' },
        ],
      };

      const response = await processImport(authToken, csvData, fieldMappings, 'contacts');

      expect(response.companies.length).toBe(0);
      expect(response.contacts.length).toBe(2);
      expect(response.contacts[0].data.firstName).toBe('John');
      expect(response.contacts[0].data.phoneNumber).toBe('555-0123');
    });

    it('should detect duplicate companies and suggest updates', async () => {
      // Create existing company
      const existingCompany = await createCompany({
        name: 'Acme Corp',
        email: 'old@acme.com',
      });

      const csvData = `Company Name,Email
Acme Corp,new@acme.com`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [
          { csvColumnIndex: 0, targetField: 'name' },
          { csvColumnIndex: 1, targetField: 'email' },
        ],
        contactMappings: [],
      };

      const response = await processImport(authToken, csvData, fieldMappings, 'companies');

      expect(response.companies.length).toBe(1);
      expect(response.companies[0].action).toBe('update');
      expect(response.companies[0].existingId).toBe(existingCompany.id);
      expect(response.companies[0].data.name).toBe('Acme Corp');
      expect(response.companies[0].data.email).toBe('new@acme.com');
    });

    it('should detect duplicate contacts and suggest updates', async () => {
      // Create existing contact
      const existingCompany = await createCompany({
        name: 'Test Company',
        email: 'test@company.com',
      });

      const existingContact = await createContact({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        companyId: existingCompany.id,
      });

      const csvData = `First Name,Last Name,Email,Job Title
John,Doe,john.doe@example.com,Senior Engineer`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [],
        contactMappings: [
          { csvColumnIndex: 0, targetField: 'firstName' },
          { csvColumnIndex: 1, targetField: 'lastName' },
          { csvColumnIndex: 2, targetField: 'email' },
          { csvColumnIndex: 3, targetField: 'jobTitle' },
        ],
      };

      const response = await processImport(authToken, csvData, fieldMappings, 'contacts');

      expect(response.contacts.length).toBe(1);
      expect(response.contacts[0].action).toBe('update');
      expect(response.contacts[0].existingId).toBe(existingContact.id);
      expect(response.contacts[0].data.jobTitle).toBe('Senior Engineer');
    });

    it('should detect duplicate email errors', async () => {
      const csvData = `Company Name,Email
Acme Corp,duplicate@example.com
Tech Corp,duplicate@example.com`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [
          { csvColumnIndex: 0, targetField: 'name' },
          { csvColumnIndex: 1, targetField: 'email' },
        ],
        contactMappings: [],
      };

      const response = await processImport(authToken, csvData, fieldMappings, 'companies');

      expect(response.duplicateEmailErrors).toBeDefined();
      expect(response.duplicateEmailErrors?.length).toBe(1);
      expect(response.duplicateEmailErrors?.[0].email).toBe('duplicate@example.com');
      expect(response.duplicateEmailErrors?.[0].type).toBe('company');
      expect(response.duplicateEmailErrors?.[0].rows).toEqual([1, 2]);
    });

    it('should handle contacts with company matching', async () => {
      // Create existing company
      const existingCompany = await createCompany({
        name: 'Acme Corp',
        email: 'info@acme.com',
      });

      const csvData = `First Name,Last Name,Email,Company Name
John,Doe,john.doe@example.com,Acme Corp`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [],
        contactMappings: [
          { csvColumnIndex: 0, targetField: 'firstName' },
          { csvColumnIndex: 1, targetField: 'lastName' },
          { csvColumnIndex: 2, targetField: 'email' },
          { csvColumnIndex: 3, targetField: 'companyName' },
        ],
      };

      const response = await processImport(authToken, csvData, fieldMappings, 'contacts');

      expect(response.contacts.length).toBe(1);
      expect(response.contacts[0].matchedCompany).toBeDefined();
      expect(response.contacts[0].matchedCompany?.id).toBe(existingCompany.id);
      expect(response.contacts[0].matchedCompany?.name).toBe('Acme Corp');
    });

    it('should validate required fields', async () => {
      const csvData = `Company Name,Email
,invalid@company.com`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [
          { csvColumnIndex: 0, targetField: 'name' },
          { csvColumnIndex: 1, targetField: 'email' },
        ],
        contactMappings: [],
      };

      await expect(processImport(authToken, csvData, fieldMappings, 'companies')).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const csvData = `First Name,Last Name,Email
John,Doe,invalid-email`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [],
        contactMappings: [
          { csvColumnIndex: 0, targetField: 'firstName' },
          { csvColumnIndex: 1, targetField: 'lastName' },
          { csvColumnIndex: 2, targetField: 'email' },
        ],
      };

      await expect(processImport(authToken, csvData, fieldMappings, 'contacts')).rejects.toThrow();
    });

    it('should reject empty CSV files', async () => {
      const csvData = '';

      await expect(processImport(authToken, csvData, importFixtures.validFieldMappings, 'mixed')).rejects.toThrow();
    });

    it('should reject CSV with headers only', async () => {
      const csvData = 'Company Name,Email,First Name,Last Name';

      await expect(processImport(authToken, csvData, importFixtures.validFieldMappings, 'mixed')).rejects.toThrow();
    });

    it('should not process import without authentication', async () => {
      setTestAuthToken('');
      await expect(
        processImport('', importFixtures.validCsvData, importFixtures.validFieldMappings, 'mixed')
      ).rejects.toThrow();
      setTestAuthToken(authToken);
    });
  });

  describe('Import Data Validation', () => {
    it('should handle all company fields', async () => {
      const csvData = `Name,Email,Website,Size,Description,Phone,Address,City,Country,PostCode
Acme Corp,info@acme.com,https://acme.com,Medium,Tech Company,555-0123,123 Main St,New York,USA,10001`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [
          { csvColumnIndex: 0, targetField: 'name' },
          { csvColumnIndex: 1, targetField: 'email' },
          { csvColumnIndex: 2, targetField: 'website' },
          { csvColumnIndex: 3, targetField: 'size' },
          { csvColumnIndex: 4, targetField: 'description' },
          { csvColumnIndex: 5, targetField: 'phoneNumber' },
          { csvColumnIndex: 6, targetField: 'address' },
          { csvColumnIndex: 7, targetField: 'city' },
          { csvColumnIndex: 8, targetField: 'country' },
          { csvColumnIndex: 9, targetField: 'postCode' },
        ],
        contactMappings: [],
      };

      const response = await processImport(authToken, csvData, fieldMappings, 'companies');

      expect(response.companies.length).toBe(1);
      const company = response.companies[0];
      expect(company.data.name).toBe('Acme Corp');
      expect(company.data.email).toBe('info@acme.com');
      expect(company.data.website).toBe('https://acme.com');
      expect(company.data.size).toBe('Medium');
      expect(company.data.description).toBe('Tech Company');
      expect(company.data.phoneNumber).toBe('555-0123');
      expect(company.data.address).toBe('123 Main St');
      expect(company.data.city).toBe('New York');
      expect(company.data.country).toBe('USA');
      expect(company.data.postCode).toBe('10001');
    });

    it('should handle all contact fields', async () => {
      const csvData = `First,Last,Email,Job,Phone,Address,City,Country,PostCode,Company
John,Doe,john.doe@example.com,Engineer,555-0123,456 Oak St,Boston,USA,02101,Acme Corp`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [],
        contactMappings: [
          { csvColumnIndex: 0, targetField: 'firstName' },
          { csvColumnIndex: 1, targetField: 'lastName' },
          { csvColumnIndex: 2, targetField: 'email' },
          { csvColumnIndex: 3, targetField: 'jobTitle' },
          { csvColumnIndex: 4, targetField: 'phoneNumber' },
          { csvColumnIndex: 5, targetField: 'address' },
          { csvColumnIndex: 6, targetField: 'city' },
          { csvColumnIndex: 7, targetField: 'country' },
          { csvColumnIndex: 8, targetField: 'postCode' },
          { csvColumnIndex: 9, targetField: 'companyName' },
        ],
      };

      const response = await processImport(authToken, csvData, fieldMappings, 'contacts');

      expect(response.contacts.length).toBe(1);
      const contact = response.contacts[0];
      expect(contact.data.firstName).toBe('John');
      expect(contact.data.lastName).toBe('Doe');
      expect(contact.data.email).toBe('john.doe@example.com');
      expect(contact.data.jobTitle).toBe('Engineer');
      expect(contact.data.phoneNumber).toBe('555-0123');
      expect(contact.data.address).toBe('456 Oak St');
      expect(contact.data.city).toBe('Boston');
      expect(contact.data.country).toBe('USA');
      expect(contact.data.postCode).toBe('02101');
      expect(contact.data.companyName).toBe('Acme Corp');
    });

    it('should normalize email addresses to lowercase', async () => {
      const csvData = `Company Name,Email
Acme Corp,INFO@ACME.COM`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [
          { csvColumnIndex: 0, targetField: 'name' },
          { csvColumnIndex: 1, targetField: 'email' },
        ],
        contactMappings: [],
      };

      const response = await processImport(authToken, csvData, fieldMappings, 'companies');

      expect(response.companies[0].data.email).toBe('info@acme.com');
    });

    it('should handle phone prefix separation', async () => {
      const csvData = `Company Name,Phone Prefix,Phone Number
Acme Corp,+1,555-0123`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [
          { csvColumnIndex: 0, targetField: 'name' },
          { csvColumnIndex: 1, targetField: 'phonePrefix' },
          { csvColumnIndex: 2, targetField: 'phoneNumber' },
        ],
        contactMappings: [],
      };

      const response = await processImport(authToken, csvData, fieldMappings, 'companies');

      expect(response.companies[0].data.phonePrefix).toBe('+1');
      expect(response.companies[0].data.phoneNumber).toBe('555-0123');
    });
  });

  describe('Integration Tests', () => {
    it('should handle complex mixed import scenario', async () => {
      // Create some existing data
      const existingCompany = await createCompany({
        name: 'Existing Corp',
        email: 'old@existing.com',
      });

      const csvData = `Company Name,Email,First Name,Last Name,Contact Email,Job Title
Existing Corp,new@existing.com,John,Doe,john.doe@example.com,Engineer
New Company,info@new.com,Jane,Smith,jane.smith@example.com,Manager
New Company,info@new.com,Bob,Johnson,bob.johnson@example.com,Developer`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [
          { csvColumnIndex: 0, targetField: 'name' },
          { csvColumnIndex: 1, targetField: 'email' },
        ],
        contactMappings: [
          { csvColumnIndex: 2, targetField: 'firstName' },
          { csvColumnIndex: 3, targetField: 'lastName' },
          { csvColumnIndex: 4, targetField: 'email' },
          { csvColumnIndex: 5, targetField: 'jobTitle' },
          { csvColumnIndex: 0, targetField: 'companyName' },
        ],
      };

      const response = await processImport(authToken, csvData, fieldMappings, 'mixed');

      // Should have 3 companies (1 update, 2 create) - each row creates a company
      expect(response.companies.length).toBe(3);
      expect(response.companies[0].action).toBe('update');
      expect(response.companies[0].existingId).toBe(existingCompany.id);
      expect(response.companies[1].action).toBe('create');
      expect(response.companies[1].data.name).toBe('New Company');
      expect(response.companies[2].action).toBe('create');
      expect(response.companies[2].data.name).toBe('New Company');

      // Should have 3 contacts (all create)
      expect(response.contacts.length).toBe(3);
      expect(response.contacts.every(c => c.action === 'create')).toBe(true);

      // Contacts should have company matching
      expect(response.contacts[0].data.companyName).toBe('Existing Corp');
      expect(response.contacts[1].data.companyName).toBe('New Company');
      expect(response.contacts[2].data.companyName).toBe('New Company');
    });
  });

  describe('POST /import/execute', () => {
    it('should execute import and create companies and contacts', async () => {
      const companyCsvData = `Company Name,Email,Website
Acme Corp,info@acme.com,https://acme.com
Tech Solutions,contact@tech.com,https://techsolutions.com`;

      const contactCsvData = `First Name,Last Name,Email,Job Title,Company Name
John,Doe,john.doe@example.com,Engineer,Acme Corp
Jane,Smith,jane.smith@example.com,Manager,Tech Solutions`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [
          { csvColumnIndex: 0, targetField: 'name' },
          { csvColumnIndex: 1, targetField: 'email' },
          { csvColumnIndex: 2, targetField: 'website' },
        ],
        contactMappings: [
          { csvColumnIndex: 0, targetField: 'firstName' },
          { csvColumnIndex: 1, targetField: 'lastName' },
          { csvColumnIndex: 2, targetField: 'email' },
          { csvColumnIndex: 3, targetField: 'jobTitle' },
          { csvColumnIndex: 4, targetField: 'companyName' },
        ],
      };

      const response = await executeImport(
        authToken,
        fieldMappings,
        'mixed',
        undefined,
        undefined,
        companyCsvData,
        contactCsvData
      );

      expect(response.success).toBe(true);
      expect(response.stats.companies).toBe(2);
      expect(response.stats.contacts).toBe(2);
      expect(response.stats.totalRecords).toBe(4);
      expect(response.stats.errors).toBe(0);
    });

    it('should execute companies only import', async () => {
      const companyCsvData = `Company Name,Email,Size
Startup Inc,info@startup.com,Small
Enterprise Corp,contact@enterprise.com,Large`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [
          { csvColumnIndex: 0, targetField: 'name' },
          { csvColumnIndex: 1, targetField: 'email' },
          { csvColumnIndex: 2, targetField: 'size' },
        ],
        contactMappings: [],
      };

      const response = await executeImport(authToken, fieldMappings, 'companies', undefined, undefined, companyCsvData);

      expect(response.success).toBe(true);
      expect(response.stats.companies).toBe(2);
      expect(response.stats.contacts).toBe(0);
      expect(response.stats.totalRecords).toBe(2);
    });

    it('should execute contacts only import', async () => {
      const contactCsvData = `First Name,Last Name,Email,Job Title
Alice,Johnson,alice.johnson@example.com,Designer
Bob,Wilson,bob.wilson@example.com,Developer`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [],
        contactMappings: [
          { csvColumnIndex: 0, targetField: 'firstName' },
          { csvColumnIndex: 1, targetField: 'lastName' },
          { csvColumnIndex: 2, targetField: 'email' },
          { csvColumnIndex: 3, targetField: 'jobTitle' },
        ],
      };

      const response = await executeImport(
        authToken,
        fieldMappings,
        'contacts',
        undefined,
        undefined,
        undefined,
        contactCsvData
      );

      expect(response.success).toBe(true);
      expect(response.stats.companies).toBe(0);
      expect(response.stats.contacts).toBe(2);
      expect(response.stats.totalRecords).toBe(2);
    });

    it('should create companies when no existing ID is provided', async () => {
      // Create existing company (but don't provide its ID in CSV)
      const existingCompany = await createCompany({
        name: 'Existing Corp',
        email: 'old@existing.com',
        size: 'Small',
      });

      const companyCsvData = `Company Name,Email,Size
New Corp,new@corp.com,Large`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [
          { csvColumnIndex: 0, targetField: 'name' },
          { csvColumnIndex: 1, targetField: 'email' },
          { csvColumnIndex: 2, targetField: 'size' },
        ],
        contactMappings: [],
      };

      const response = await executeImport(authToken, fieldMappings, 'companies', undefined, undefined, companyCsvData);

      expect(response.success).toBe(true);
      expect(response.stats.companies).toBe(1);
      expect(response.stats.totalRecords).toBe(1);

      // Verify the existing company was not modified
      const unchangedCompany = await getCompany(existingCompany.id);
      expect(unchangedCompany.email).toBe('old@existing.com');
      expect(unchangedCompany.size).toBe('Small');
    });

    it('should create contacts when no existing ID is provided', async () => {
      // Create existing contact (but don't provide its ID in CSV)
      const existingCompany = await createCompany({
        name: 'Test Company',
        email: 'test@company.com',
      });

      const existingContact = await createContact({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        jobTitle: 'Engineer',
        companyId: existingCompany.id,
      });

      const contactCsvData = `First Name,Last Name,Email,Job Title
Jane,Smith,jane.smith@example.com,Designer`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [],
        contactMappings: [
          { csvColumnIndex: 0, targetField: 'firstName' },
          { csvColumnIndex: 1, targetField: 'lastName' },
          { csvColumnIndex: 2, targetField: 'email' },
          { csvColumnIndex: 3, targetField: 'jobTitle' },
        ],
      };

      const response = await executeImport(
        authToken,
        fieldMappings,
        'contacts',
        undefined,
        undefined,
        undefined,
        contactCsvData
      );

      expect(response.success).toBe(true);
      expect(response.stats.contacts).toBe(1);
      expect(response.stats.totalRecords).toBe(1);

      // Verify the existing contact was not modified
      const unchangedContact = await getContact(existingContact.id);
      expect(unchangedContact.jobTitle).toBe('Engineer');
    });

    it('should handle validation errors during execution', async () => {
      const companyCsvData = `Company Name,Email
,invalid@company.com
Valid Company,valid@company.com`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [
          { csvColumnIndex: 0, targetField: 'name' },
          { csvColumnIndex: 1, targetField: 'email' },
        ],
        contactMappings: [],
      };

      const response = await executeImport(authToken, fieldMappings, 'companies', undefined, undefined, companyCsvData);

      expect(response.success).toBe(false);
      expect(response.stats.errors).toBeGreaterThan(0);
      expect(response.errors).toBeDefined();
      expect(response.errors?.[0]).toHaveProperty('row');
      expect(response.errors?.[0]).toHaveProperty('field');
      expect(response.errors?.[0]).toHaveProperty('message');
    });

    it('should not execute import without authentication', async () => {
      const fieldMappings: ImportFieldMappings = {
        companyMappings: [{ csvColumnIndex: 0, targetField: 'name' }],
        contactMappings: [],
      };

      setTestAuthToken('');
      await expect(
        executeImport('', fieldMappings, 'companies', undefined, undefined, 'Company Name\nTest Company')
      ).rejects.toThrow();
      setTestAuthToken(authToken);
    });

    it('should handle mixed import with company-contact relationships', async () => {
      const companyCsvData = `Company Name,Email
Acme Corp,info@acme.com
Tech Solutions,contact@tech.com`;

      const contactCsvData = `First Name,Last Name,Email,Job Title,Company Name
John,Doe,john.doe@example.com,Engineer,Acme Corp
Jane,Smith,jane.smith@example.com,Manager,Tech Solutions
Bob,Johnson,bob.johnson@example.com,Developer,Acme Corp`;

      const fieldMappings: ImportFieldMappings = {
        companyMappings: [
          { csvColumnIndex: 0, targetField: 'name' },
          { csvColumnIndex: 1, targetField: 'email' },
        ],
        contactMappings: [
          { csvColumnIndex: 0, targetField: 'firstName' },
          { csvColumnIndex: 1, targetField: 'lastName' },
          { csvColumnIndex: 2, targetField: 'email' },
          { csvColumnIndex: 3, targetField: 'jobTitle' },
          { csvColumnIndex: 4, targetField: 'companyName' },
        ],
      };

      const response = await executeImport(
        authToken,
        fieldMappings,
        'mixed',
        undefined,
        undefined,
        companyCsvData,
        contactCsvData
      );

      expect(response.success).toBe(true);
      expect(response.stats.companies).toBe(2);
      expect(response.stats.contacts).toBe(3);
      expect(response.stats.totalRecords).toBe(5);
      expect(response.stats.errors).toBe(0);
    });
  });
});
