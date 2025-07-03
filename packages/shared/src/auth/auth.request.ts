import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const loginRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export class LoginRequest extends createZodDto(loginRequestSchema) {}

const registerRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export class RegisterRequest extends createZodDto(registerRequestSchema) {}
