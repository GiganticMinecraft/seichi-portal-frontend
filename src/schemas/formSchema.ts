import { z } from 'zod';

const questionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  question_type: z.enum(['TEXT', 'SINGLE', 'MULTIPLE']),
  choices: z.array(z.string()),
  is_required: z.boolean(),
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
  description: z.string().nullable(),
  settings: settingsSchema,
  metadata: metadataSchema,
  questions: questionSchema.array(),
});

export const formsSchema = z.array(formSchema);

export const answerSchema = z.object({
  question_id: z.number(),
  answer: z.string(),
});

export const batchAnswerSchema = z.object({
  uuid: z.string(),
  timestamp: z.string().datetime(),
  title: z.string(),
  form_id: z.number(),
  answers: z.array(answerSchema),
});

export const batchAnswersSchema = z.array(batchAnswerSchema);

export type BatchAnswer = z.infer<typeof batchAnswerSchema>;

export type Form = z.infer<typeof formSchema>;

export type FormQuestion = z.infer<typeof questionSchema>;
