import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createTodoSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional().nullable(),
  reminderDate: z.coerce.date(),
  resolved: z.boolean().optional().default(false),
  contactId: z.number().int().positive().optional().nullable(),
  companyId: z.number().int().positive().optional().nullable(),
});

const updateTodoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional().nullable(),
  reminderDate: z.coerce.date().optional(),
  resolved: z.boolean().optional(),
});

const getAllTodosQuerySchema = z.object({
  status: z.enum(['pending', 'resolved', 'upcoming']).optional(),
  contactId: z.coerce.number().int().positive().optional(),
  companyId: z.coerce.number().int().positive().optional(),
});

export const todoSchema = {
  create: createTodoSchema,
  update: updateTodoSchema,
  getAllQuery: getAllTodosQuerySchema,
};

export { getAllTodosQuerySchema };

export class CreateTodoRequest extends createZodDto(createTodoSchema) {}
export class UpdateTodoRequest extends createZodDto(updateTodoSchema) {}
export class GetAllTodosQueryRequest extends createZodDto(getAllTodosQuerySchema) {}

export type CreateTodoDto = z.infer<typeof createTodoSchema>;
export type UpdateTodoDto = z.infer<typeof updateTodoSchema>;
export type GetAllTodosQueryDto = z.infer<typeof getAllTodosQuerySchema>;
