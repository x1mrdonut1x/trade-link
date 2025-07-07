import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional().nullable(),
  reminderDate: z.union([z.literal(''), z.string().date().optional().nullable()]),
  resolved: z.boolean().optional(),
  contactId: z.number().int().positive().optional().nullable(),
  companyId: z.number().int().positive().optional().nullable(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional().nullable(),
  reminderDate: z.union([z.literal(''), z.string().date().optional().nullable()]),
  resolved: z.boolean().optional(),
});

const getAllTasksQuerySchema = z.object({
  status: z.enum(['pending', 'resolved', 'upcoming']).optional(),
  contactId: z.coerce.number().int().positive().optional(),
  companyId: z.coerce.number().int().positive().optional(),
});

export const taskSchema = {
  create: createTaskSchema,
  update: updateTaskSchema,
  getAllQuery: getAllTasksQuerySchema,
};

export { getAllTasksQuerySchema };

export class CreateTaskRequest extends createZodDto(createTaskSchema) {}
export class UpdateTaskRequest extends createZodDto(updateTaskSchema) {}
export class GetAllTasksQueryRequest extends createZodDto(getAllTasksQuerySchema) {}

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
export type GetAllTasksQueryDto = z.infer<typeof getAllTasksQuerySchema>;
