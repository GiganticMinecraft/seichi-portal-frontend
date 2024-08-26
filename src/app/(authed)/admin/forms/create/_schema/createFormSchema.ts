import { z } from 'zod';

const choiceSchema = z.object({
  choice: z.string(),
});

export const questionSchema = z.object({
  title: z.string(),
  description: z.string(),
  question_type: z.enum(['TEXT', 'SINGLE', 'MULTIPLE']),
  choices: choiceSchema.array(),
  is_required: z.boolean(),
});

const visibility = z.enum(['PUBLIC', 'PRIVATE']);

export const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: questionSchema.array(),
  settings: z.object({
    has_response_period: z.boolean(),
    response_period: z.object({
      // 本当はここをdatetime型にしたいが、ここをdatetimeにすると入力側の処理が面倒になるので、とりあえずstring型にしておく
      start_at: z.string().nullable(),
      end_at: z.string().nullable(),
    }),
    webhook_url: z.string().nullable(),
    default_answer_title: z.string().nullable(),
    visibility: visibility,
    answer_visibility: visibility,
  }),
});

export type Form = z.infer<typeof formSchema>;

export type Visibility = z.infer<typeof visibility>;
