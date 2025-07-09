import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { paginationSchema } from '../common';

const createEventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  type: z.string().min(1, 'Event type is required'),
  startDate: z.string().date(),
  endDate: z.string().date(),
  location: z.string().min(1, 'Location is required'),
  venue: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.string().optional().default('Planning'),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  companyIds: z.array(z.number().int().positive()).optional().default([]),
  contactIds: z.array(z.number().int().positive()).optional().default([]),
  tagIds: z.array(z.number().int().positive()).optional().default([]),
});

const updateEventSchema = createEventSchema.partial();

export const eventSchema = {
  create: createEventSchema,
  update: updateEventSchema,
};

export type CreateEventRequestInput = z.input<typeof createEventSchema>;
export class CreateEventRequest extends createZodDto(createEventSchema) {}
export class UpdateEventRequest extends createZodDto(updateEventSchema) {}

export const getAllEventsQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().date().optional().nullable(),
  endDate: z.string().date().optional().nullable(),
  tagIds: z
    .string()
    .optional()
    .transform(val => (val ? val.split(',').map(id => parseInt(id, 10)) : undefined)),
  sortBy: z.enum(['name', 'startDate', 'endDate', 'createdAt']).optional().default('startDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export class GetAllEventsQuery extends createZodDto(getAllEventsQuerySchema) {}

export type CreateEventDto = z.infer<typeof createEventSchema>;
export type UpdateEventDto = z.infer<typeof updateEventSchema>;
export type GetAllEventsQueryDto = z.infer<typeof getAllEventsQuerySchema>;
