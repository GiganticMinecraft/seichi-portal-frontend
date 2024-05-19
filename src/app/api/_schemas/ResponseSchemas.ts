import { z } from 'zod';

/**
 * バックエンドサーバーからのレスポンススキーマの定義。
 */

// GET /forms
export const createFormResponseSchema = z.object({
  id: z.number(),
});

export type CreateFormResponse = z.infer<typeof createFormResponseSchema>;

// GET /forms/:form_id
export const getFormResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  questions: z
    .object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      question_type: z.enum(['TEXT', 'SINGLE', 'MULTIPLE']),
      choices: z.string().array(),
      is_required: z.boolean(),
    })
    .array(),
  settings: z.object({
    response_period: z
      .object({
        start_at: z.string().nullable(),
        end_at: z.string().nullable(),
      })
      .nullable(),
    webhook_url: z.string().nullable(),
    visibility: z.enum(['PUBLIC', 'PRIVATE']),
    default_answer_title: z.string().nullable(),
  }),
  metadata: z.object({
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
  }),
});

export type GetFormResponse = z.infer<typeof getFormResponseSchema>;

// GET /forms/:formId/questions
export const getQuestionsResponseSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    question_type: z.enum(['TEXT', 'SINGLE', 'MULTIPLE']),
    choices: z.string().array(),
    is_required: z.boolean(),
  })
  .array();

export type GetQuestionsResponse = z.infer<typeof getQuestionsResponseSchema>;

// GET /forms/answers
export const getAnswersResponseSchema = z.object({
  uuid: z.string(),
  timestamp: z.string().datetime(),
  form_id: z.number(),
  title: z.string(),
  answers: z
    .object({
      question_id: z.number(),
      answer: z.string(),
    })
    .array(),
});

export type GetAnswersResponse = z.infer<typeof getAnswersResponseSchema>;
