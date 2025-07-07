import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { paginationSchema } from '../common';

const createContactSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  jobTitle: z.string().optional().nullable(),
  phonePrefix: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  companyId: z.number().optional().nullable(),
  // location
  country: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  postCode: z.string().optional().nullable(),
});

const updateContactSchema = createContactSchema.partial();

export const contactSchema = {
  create: createContactSchema,
  update: updateContactSchema,
};

export class CreateContactRequest extends createZodDto(createContactSchema) {}
export class UpdateContactRequest extends createZodDto(updateContactSchema) {}

export const getAllContactsQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  tagIds: z
    .union([z.string(), z.array(z.number())])
    .optional()
    .transform(val => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      return val.split(',').map(Number);
    })
    .refine(arr => arr.every(num => !isNaN(num)), 'All tag IDs must be valid numbers'),
});

export class GetAllContactsQuery extends createZodDto(getAllContactsQuerySchema) {}
