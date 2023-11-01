import { z } from 'zod';

const questionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  question_type: z.enum(['TEXT', 'SINGLE', 'MULTIPLE']),
  choices: z.array(z.string()),
  is_required: z.boolean(),
});

export const questionsSchema = z.array(questionSchema);

const responsePeriodSchema = z.object({
  start_at: z.string().datetime().nullable(),
  end_at: z.string().datetime().nullable(),
});

export const formSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  response_period: responsePeriodSchema,
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
