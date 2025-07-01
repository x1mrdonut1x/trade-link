import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
});

export class CreateUserRequest extends createZodDto(createUserSchema) {}

const UpdateUserSchema = createUserSchema.partial();

export class UpdateUserRequest extends createZodDto(UpdateUserSchema) {}
