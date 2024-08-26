import { z } from 'zod';

/**
 * バックエンドサーバーにリクエストするためのスキーマの定義。
 */

// POST /forms
export const createFormSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export type CreateFormSchema = z.infer<typeof createFormSchema>;

// POST /forms/questions
export const createQuestionSchema = z.object({
  form_id: z.number(),
  questions: z
    .object({
      title: z.string(),
      description: z.string(),
      question_type: z.enum(['TEXT', 'SINGLE', 'MULTIPLE']),
      choices: z.string().array(),
      is_required: z.boolean(),
    })
    .array(),
});

// PATCH /forms/:form_id
export const updateFormSchema = z.object({
  title: z.string().nullable(),
  description: z.string().nullable(),
  has_response_period: z.boolean().nullable(),
  response_period: z.object({
    start_at: z.string().nullable(),
    end_at: z.string().nullable(),
  }),
  webhook_url: z.string().nullable(),
  default_answer_title: z.string().nullable(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
  answer_visibility: z.enum(['PUBLIC', 'PRIVATE']),
});

// PUT /forms/questions
export const updateQuestionSchema = z.object({
  form_id: z.number(),
  questions: z
    .object({
      id: z.number().nullable(),
      title: z.string(),
      description: z.string(),
      question_type: z.enum(['TEXT', 'SINGLE', 'MULTIPLE']),
      choices: z.string().array(),
      is_required: z.boolean(),
    })
    .array(),
});

// PATCH /forms/answers/:answer_id
export const updateAnswerSchema = z.object({
  title: z.string().nullable(),
});
