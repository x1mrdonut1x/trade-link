import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createNoteSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional().nullable(),
  contactId: z.number().int().positive().optional().nullable(),
  companyId: z.number().int().positive().optional().nullable(),
});

const updateNoteSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional().nullable(),
});

export const noteSchema = {
  create: createNoteSchema,
  update: updateNoteSchema,
};

export class CreateNoteRequest extends createZodDto(createNoteSchema) {}
export class UpdateNoteRequest extends createZodDto(updateNoteSchema) {}

export type CreateNoteDto = z.infer<typeof createNoteSchema>;
export type UpdateNoteDto = z.infer<typeof updateNoteSchema>;
