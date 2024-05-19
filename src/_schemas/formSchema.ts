import { z } from 'zod';

export const questionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  question_type: z.enum(['TEXT', 'SINGLE', 'MULTIPLE']),
  choices: z.array(z.string()),
  is_required: z.boolean(),
});

const responsePeriodSchema = z.object({
  start_at: z.string().datetime().nullable(),
  end_at: z.string().datetime().nullable(),
});

export const mimimumFormSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  response_period: responsePeriodSchema,
});

export const answerSchema = z.object({
  question_id: z.number(),
  answer: z.string(),
});

export const batchAnswerSchema = z.object({
  uuid: z.string(),
  timestamp: z.string().datetime(),
  form_id: z.number(),
  title: z.string(),
  answers: z.array(answerSchema),
});

export type BatchAnswer = z.infer<typeof batchAnswerSchema>;

export type MinimumForm = z.infer<typeof mimimumFormSchema>;

export type FormQuestion = z.infer<typeof questionSchema>;
