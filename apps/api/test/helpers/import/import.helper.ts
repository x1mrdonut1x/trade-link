import type { ImportFieldMappings, ImportType } from '@tradelink/shared';
import request from 'supertest';
import { getTestApp } from '../../setup';

export interface ImportFixtures {
  validCsvData: string;
  validFieldMappings: ImportFieldMappings;
  invalidCsvData: string;
}

export const importFixtures: ImportFixtures = {
  validCsvData: `firstName,lastName,email,company,jobTitle
John,Doe,john.doe@example.com,Test Company,Software Engineer
Jane,Smith,jane.smith@example.com,Another Company,Product Manager`,
  validFieldMappings: {
    companyMappings: [{ csvColumnIndex: 3, targetField: 'name' }],
    contactMappings: [
      { csvColumnIndex: 0, targetField: 'firstName' },
      { csvColumnIndex: 1, targetField: 'lastName' },
      { csvColumnIndex: 2, targetField: 'email' },
      { csvColumnIndex: 4, targetField: 'jobTitle' },
    ],
  },
  invalidCsvData: `invalid,data
without,proper,headers`,
};

export const processImport = async (
  token: string,
  csvData: string,
  fieldMappings: ImportFieldMappings,
  importType: ImportType = 'mixed'
) => {
  const app = getTestApp();
  const csvBuffer = Buffer.from(csvData);

  const response = await request(app.getHttpServer())
    .post('/import/process')
    .set('Authorization', `Bearer ${token}`)
    .attach('csvFile', csvBuffer, 'test.csv')
    .field('fieldMappings', JSON.stringify(fieldMappings))
    .field('importType', importType);

  if (response.status >= 400) {
    throw new Error(`HTTP ${response.status}: ${response.body.message || 'Request failed'}`);
  }

  return response.body;
};

export const executeImport = async (
  token: string,
  fieldMappings: ImportFieldMappings,
  importType: ImportType = 'mixed',
  skippedCompanyRows?: number[],
  skippedContactRows?: number[],
  companyCsvData?: string,
  contactCsvData?: string
) => {
  const app = getTestApp();

  const req = request(app.getHttpServer())
    .post('/import/execute')
    .set('Authorization', `Bearer ${token}`)
    .field('fieldMappings', JSON.stringify(fieldMappings))
    .field('importType', importType);

  if (skippedCompanyRows) {
    req.field('skippedCompanyRows', JSON.stringify(skippedCompanyRows));
  }

  if (skippedContactRows) {
    req.field('skippedContactRows', JSON.stringify(skippedContactRows));
  }

  if (companyCsvData) {
    const companyCsvBuffer = Buffer.from(companyCsvData);
    req.attach('companyCsvFile', companyCsvBuffer, 'companies.csv');
  }

  if (contactCsvData) {
    const contactCsvBuffer = Buffer.from(contactCsvData);
    req.attach('contactCsvFile', contactCsvBuffer, 'contacts.csv');
  }

  const response = await req;

  if (response.status >= 400) {
    throw new Error(`HTTP ${response.status}: ${response.body.message || 'Request failed'}`);
  }

  return response.body;
};
