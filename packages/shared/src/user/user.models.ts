import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export class CreateUserRequest extends createZodDto(createUserSchema) {}

const UpdateUserSchema = createUserSchema.omit({ password: true }).partial();

export class UpdateUserRequest extends createZodDto(UpdateUserSchema) {}
