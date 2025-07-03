import { z } from 'zod';

export const paginationSchema = z.object({
  size: z.number({ coerce: true }).min(1).max(100).default(30),
  page: z.number({ coerce: true }).min(1).default(1),
});
