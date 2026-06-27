import { z } from 'zod';

const requiredStringSchema = z.string().trim().min(1, '入力してください。');

export const questionTypeSchema = z.enum([
  'Text',
  'SingleChoice',
  'MultipleChoice',
]);

const choiceSchema = z.object({
  choice: requiredStringSchema,
});

export const visibilitySchema = z.enum(['PUBLIC', 'PRIVATE']);

const formLabelSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const formEditorQuestionSchema = z
  .object({
    id: z.string().nullable().optional(),
    title: requiredStringSchema,
    description: z.string(),
    question_type: questionTypeSchema,
    choices: choiceSchema.array(),
    is_required: z.boolean(),
    position: z.number().int().gte(0),
    template_key: z.string(),
  })
  .superRefine((question, context) => {
    if (question.question_type !== 'Text' && question.choices.length === 0) {
      context.addIssue({
        code: 'custom',
        path: ['choices'],
        message: '選択肢を1つ以上追加してください。',
      });
    }
  });

export const formEditorSchema = z.object({
  title: requiredStringSchema,
  description: requiredStringSchema,
  questions: formEditorQuestionSchema
    .array()
    .min(1, '質問を1つ以上追加してください。'),
  labels: formLabelSchema.array(),
  settings: z.object({
    has_acceptance_period: z.boolean(),
    acceptance_period: z.object({
      start_at: z.string().nullable(),
      end_at: z.string().nullable(),
    }),
    discord_webhook_url: z.string().nullable(),
    default_answer_title: z.string().nullable(),
    visibility: visibilitySchema,
    answer_visibility: visibilitySchema,
    allow_temporary_answers: z.boolean(),
  }),
});

export type FormEditorValues = z.infer<typeof formEditorSchema>;
export type FormEditorQuestion = z.infer<typeof formEditorQuestionSchema>;
export type FormVisibility = z.infer<typeof visibilitySchema>;
