import { z } from 'zod';

const questionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  question_type: z.enum(['TEXT', 'SINGLE', 'MULTIPLE']),
  choices: z.array(z.string()),
});

const metadataSchema = z.object({
  created_at: z.string().datetime(),
  update_at: z.string().datetime(),
});

const responsePeriodSchema = z.object({
  start_at: z.string().datetime().nullable(),
  end_at: z.string().datetime().nullable(),
});

const settingsSchema = z.object({
  response_period: responsePeriodSchema,
  webhook_url: z.string().nullable(),
});

export const formSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  settings: settingsSchema,
  metadata: metadataSchema,
  questions: questionSchema.array(),
});

export const formsSchema = z.array(formSchema);

export type Form = z.infer<typeof formSchema>;

export type FormQuestion = z.infer<typeof questionSchema>;
