import { z } from 'zod';

export const createLabelSchema = z.object({
  name: z.string(),
});

export type CreateLabelSchema = z.infer<typeof createLabelSchema>;

export const editLabelSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type EditLabelSchema = z.infer<typeof editLabelSchema>;
