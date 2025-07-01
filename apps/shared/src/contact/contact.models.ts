import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createContactSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  jobTitle: z.string().optional(),
  contactData: z.object({
    country: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    postCode: z.string().optional(),
    phonePrefix: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
  companyId: z.number().optional(),
});

const updateContactSchema = createContactSchema.partial();

export const contactSchema = {
  create: createContactSchema,
  update: updateContactSchema,
};

export class CreateContactRequest extends createZodDto(createContactSchema) {}
export class UpdateContactRequest extends createZodDto(updateContactSchema) {}

export type CreateContactType = z.infer<typeof createContactSchema>;
export type UpdateContactType = z.infer<typeof updateContactSchema>;
