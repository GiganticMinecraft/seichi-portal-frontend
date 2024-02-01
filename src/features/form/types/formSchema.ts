import { z } from 'zod';

export const questionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  question_type: z.enum(['TEXT', 'SINGLE', 'MULTIPLE']),
  choices: z.array(z.string()),
  is_required: z.boolean(),
});

export const questionsSchema = questionSchema.array();

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
  default_answer_title: z.string().nullable(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
});

export const mimimumFormSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  response_period: responsePeriodSchema,
});

export const mimimumFormsSchema = z.array(mimimumFormSchema);

export const formSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  questions: questionSchema.array(),
  metadata: metadataSchema,
  settings: settingsSchema,
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

export const batchAnswersSchema = z.array(batchAnswerSchema);

export type BatchAnswer = z.infer<typeof batchAnswerSchema>;

export type MinimumForm = z.infer<typeof mimimumFormSchema>;

export type Form = z.infer<typeof formSchema>;

export type FormQuestion = z.infer<typeof questionSchema>;
