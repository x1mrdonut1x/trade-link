import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { paginationSchema } from '../common';

const createTagRequestSchema = z.object({
  name: z.string().min(1, 'Tag name is required'),
  color: z.string().min(1, 'Tag color is required'),
});

const updateTagRequestSchema = createTagRequestSchema.partial();

export const tagSchema = {
  create: createTagRequestSchema,
  update: updateTagRequestSchema,
};

export class CreateTagRequest extends createZodDto(createTagRequestSchema) {}
export class UpdateTagRequest extends createZodDto(updateTagRequestSchema) {}

export const getAllTagsQuerySchema = paginationSchema.extend({
  sortBy: z.enum(['name', 'color', 'createdAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export class GetAllTagsQuery extends createZodDto(getAllTagsQuerySchema) {}

// For managing tag assignments
export const assignTagsRequestSchema = z.object({
  tagIds: z.array(z.number()).min(1, 'At least one tag must be selected'),
});

export class AssignTagsRequest extends createZodDto(assignTagsRequestSchema) {}

export const unassignTagsRequestSchema = z.object({
  tagIds: z.array(z.number()).min(1, 'At least one tag must be selected'),
});

export class UnassignTagsRequest extends createZodDto(unassignTagsRequestSchema) {}
