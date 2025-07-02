import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createCompanySchema = z.object({
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
  // extraInfo: z
  //   .object({
  //     website: z.string().url('Please enter a valid URL').optional().nullable(),
  //     industry: z.string().optional().nullable(),
  //     size: z.string().optional().nullable(),
  //     foundedYear: z.number().optional().nullable(),
  //     revenue: z.string().optional().nullable(),
  //   })
  //   .optional()
  //   .nullable(),
});

const updateCompanySchema = createCompanySchema.partial();

export const companySchema = {
  create: createCompanySchema,
  update: updateCompanySchema,
};

export class CreateCompanyRequest extends createZodDto(createCompanySchema) {}
export class UpdateCompanyRequest extends createZodDto(updateCompanySchema) {}
