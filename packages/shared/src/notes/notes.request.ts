import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional().nullable(),
  contactId: z.number().int().positive().optional().nullable(),
  companyId: z.number().int().positive().optional().nullable(),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional().nullable(),
});

const getAllNotesQuerySchema = z.object({
  contactId: z.coerce.number().int().positive().optional(),
  companyId: z.coerce.number().int().positive().optional(),
});

export const noteSchema = {
  create: createNoteSchema,
  update: updateNoteSchema,
};

export class CreateNoteRequest extends createZodDto(createNoteSchema) {}
export class UpdateNoteRequest extends createZodDto(updateNoteSchema) {}
export class GetAllNotesRequest extends createZodDto(getAllNotesQuerySchema) {}

export type CreateNoteDto = z.infer<typeof createNoteSchema>;
export type UpdateNoteDto = z.infer<typeof updateNoteSchema>;
