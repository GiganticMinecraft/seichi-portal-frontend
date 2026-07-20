import { z } from 'zod';

const requiredStringSchema = z.string().trim().min(1, '入力してください。');

const templateKeyPattern = /^[A-Za-z0-9_-]{1,255}$/;
const reservedTemplateKeys = new Set(['username', 'form_name']);

const templateKeySchema = z
  .string()
  .trim()
  .refine((value) => value === '' || templateKeyPattern.test(value), {
    message:
      'テンプレートキーは半角英数字・_・- のみ使用できます（1〜255文字）。',
  })
  .refine((value) => !reservedTemplateKeys.has(value), {
    message: 'username と form_name は予約語のため使用できません。',
  });

export const questionTypeSchema = z.enum([
  'Text',
  'SingleChoice',
  'MultipleChoice',
]);

const choiceSchema = z.object({
  id: z.number().int().nullable().optional(),
  choice: requiredStringSchema,
});

export const visibilitySchema = z.enum(['PUBLIC', 'PRIVATE']);

const formLabelSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const formEditorQuestionIdentitySchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('new') }),
  z.object({ kind: z.literal('existing'), id: z.string() }),
]);

export const formEditorQuestionSchema = z
  .object({
    identity: formEditorQuestionIdentitySchema,
    title: requiredStringSchema,
    description: z.string(),
    question_type: questionTypeSchema,
    choices: choiceSchema.array(),
    is_required: z.boolean(),
    position: z.number().int().gte(0),
    template_key: templateKeySchema,
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

const acceptancePeriodSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('none') }),
  z.object({
    kind: z.literal('specified'),
    startAt: z.string().min(1, '回答開始日を入力してください。'),
    endAt: z.string().min(1, '回答終了日を入力してください。'),
  }),
]);

export type AcceptancePeriodSetting = z.infer<typeof acceptancePeriodSchema>;

export const formEditorSchema = z.object({
  title: requiredStringSchema,
  description: requiredStringSchema,
  questions: formEditorQuestionSchema
    .array()
    .min(1, '質問を1つ以上追加してください。'),
  labels: formLabelSchema.array(),
  settings: z.object({
    acceptance_period: acceptancePeriodSchema,
    discord_webhook_url: z.string(),
    default_answer_title: z.string(),
    visibility: visibilitySchema,
    allowed_group_ids: z.array(z.string()),
    answer_visibility: visibilitySchema,
    answer_group_ids: z.array(z.string()),
    allow_temporary_answers: z.boolean(),
  }),
});

export type FormEditorValues = z.infer<typeof formEditorSchema>;
export type FormEditorQuestion = z.infer<typeof formEditorQuestionSchema>;
export type FormEditorQuestionIdentity = z.infer<
  typeof formEditorQuestionIdentitySchema
>;
export type FormVisibility = z.infer<typeof visibilitySchema>;
