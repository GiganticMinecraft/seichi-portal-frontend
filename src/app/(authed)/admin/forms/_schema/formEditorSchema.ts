import { z } from 'zod';

export const questionTypeSchema = z.enum([
  'Text',
  'SingleChoice',
  'MultipleChoice',
]);

const choiceSchema = z.object({
  choice: z.string(),
});

export const visibilitySchema = z.enum(['PUBLIC', 'PRIVATE']);

const formLabelSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const formEditorQuestionSchema = z.object({
  id: z.string().nullable().optional(),
  title: z.string(),
  description: z.string(),
  question_type: questionTypeSchema,
  choices: choiceSchema.array(),
  is_required: z.boolean(),
  position: z.number().int().gte(0),
  template_key: z.string(),
});

export const formEditorSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: formEditorQuestionSchema.array(),
  labels: formLabelSchema.array(),
  settings: z.object({
    has_response_period: z.boolean(),
    response_period: z.object({
      start_at: z.string().nullable(),
      end_at: z.string().nullable(),
    }),
    webhook_url: z.string().nullable(),
    default_answer_title: z.string().nullable(),
    visibility: visibilitySchema,
    answer_visibility: visibilitySchema,
  }),
});

export type FormEditorValues = z.infer<typeof formEditorSchema>;
export type FormEditorQuestion = z.infer<typeof formEditorQuestionSchema>;
export type FormVisibility = z.infer<typeof visibilitySchema>;
