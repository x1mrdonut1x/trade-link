import { z } from 'zod';

export const CreateTenantRequestSchema = z.object({
  name: z.string().min(1, 'Tenant name is required').max(100, 'Tenant name must be less than 100 characters'),
});

export type CreateTenantRequest = z.infer<typeof CreateTenantRequestSchema>;

export const UpdateTenantRequestSchema = z.object({
  name: z
    .string()
    .min(1, 'Tenant name is required')
    .max(100, 'Tenant name must be less than 100 characters')
    .optional(),
});

export type UpdateTenantRequest = z.infer<typeof UpdateTenantRequestSchema>;
