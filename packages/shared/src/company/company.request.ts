import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { paginationSchema } from '../common';

const createCompanyRequestSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  email: z.string().email('Please enter a valid email').optional().nullable(),
  phonePrefix: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  // location
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  postCode: z.string().optional().nullable(),
  //extra
  tags: z.array(z.string()).optional().nullable(),
});

const updateCompanySchema = createCompanyRequestSchema.partial();

export const companySchema = {
  create: createCompanyRequestSchema,
  update: updateCompanySchema,
};

export class CreateCompanyRequest extends createZodDto(createCompanyRequestSchema) {}
export class UpdateCompanyRequest extends createZodDto(updateCompanySchema) {}

export const getAllCompaniesQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  sortBy: z.enum(['name', 'email', 'phoneNumber', 'city', 'contacts', 'website']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export class GetAllCompaniesQuery extends createZodDto(getAllCompaniesQuerySchema) {}
