import { z } from 'zod';

export const userSchema = z.object({
  uuid: z.string().uuid(),
  name: z.string(),
  role: z.enum(['ADMINISTRATOR', 'STANDARD_USER']),
});

export type User = z.infer<typeof userSchema>;
