import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Field mapping schema - using column index instead of name
const importFieldMappingSchema = z.object({
  csvColumnIndex: z.number(),
  targetField: z.string(),
});

// Separate mappings for companies and contacts
const importFieldMappingsSchema = z.object({
  companyMappings: z.array(importFieldMappingSchema),
  contactMappings: z.array(importFieldMappingSchema),
});

// Import types
const importTypeSchema = z.enum(['companies', 'contacts', 'mixed']);

// Process import request schema
const importProcessRequestSchema = z.object({
  fieldMappings: importFieldMappingsSchema,
  importType: importTypeSchema,
});

// Company import data schema
export const companyImportDataSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  email: z
    .string()
    .email('Please enter a valid email')
    .transform(val => val.toLocaleLowerCase())
    .optional()
    .nullable(),
  phonePrefix: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  postCode: z.string().optional().nullable(),
  createdAt: z.string().pipe(z.coerce.date()).optional().nullable(),
});

// Contact import data schema
export const contactImportDataSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z
    .string()
    .email('Please enter a valid email')
    .transform(val => val.toLocaleLowerCase()),
  jobTitle: z.string().optional().nullable(),
  phonePrefix: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  postCode: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  createdAt: z.string().pipe(z.coerce.date()).optional().nullable(),
});

// Execute import request schema (using CSV files)
const importExecuteRequestSchema = z.object({
  fieldMappings: importFieldMappingsSchema,
  importType: importTypeSchema,
  skippedCompanyRows: z.array(z.number()).optional(),
  skippedContactRows: z.array(z.number()).optional(),
});

// Export DTO classes
export class ImportProcessRequest extends createZodDto(importProcessRequestSchema) {}
export class ImportExecuteRequest extends createZodDto(importExecuteRequestSchema) {}

// Export types
export interface ImportFieldMapping<T> {
  csvColumnIndex: number;
  targetField: keyof T;
}

export interface ImportFieldMappings {
  companyMappings: ImportFieldMapping<CompanyImportData>[];
  contactMappings: ImportFieldMapping<ContactImportData>[];
}

export type ImportType = z.infer<typeof importTypeSchema>;
export type CompanyImportData = z.infer<typeof companyImportDataSchema>;
export type ContactImportData = z.infer<typeof contactImportDataSchema>;
