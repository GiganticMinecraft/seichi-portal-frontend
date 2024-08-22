import { z } from 'zod';

export const createLabelSchema = z.object({
  name: z.string(),
});

export type CreateLabelSchema = z.infer<typeof createLabelSchema>;
