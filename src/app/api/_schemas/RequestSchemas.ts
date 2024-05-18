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
      id: z.number().nullable(),
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
  form_id: z.number(),
  title: z.string(),
  description: z.string(),
  start_at: z.string().nullable(),
  end_at: z.string().nullable(),
  webhook: z.string().nullable(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
  default_answer_title: z.string().nullable(),
});

// PUT /forms/questions
export const updateQuestionSchema = z.object({
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
