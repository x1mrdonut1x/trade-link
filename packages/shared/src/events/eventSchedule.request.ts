import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createEventScheduleSchema = z.object({
  time: z.string().min(1, 'Time is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  type: z.string().min(1, 'Type is required'),
  location: z.string().optional().nullable(),
  contactIds: z.array(z.number().int().positive()).optional(),
  companyIds: z.array(z.number().int().positive()).optional(),
});

const updateEventScheduleSchema = createEventScheduleSchema.partial();

export const eventScheduleSchema = {
  create: createEventScheduleSchema,
  update: updateEventScheduleSchema,
};

export class CreateEventScheduleRequest extends createZodDto(createEventScheduleSchema) {}
export class UpdateEventScheduleRequest extends createZodDto(updateEventScheduleSchema) {}

export type CreateEventScheduleDto = z.infer<typeof createEventScheduleSchema>;
export type UpdateEventScheduleDto = z.infer<typeof updateEventScheduleSchema>;
