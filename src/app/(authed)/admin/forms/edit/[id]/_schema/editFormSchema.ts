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

const _visibility = z.enum(['PUBLIC', 'PRIVATE']);

export const formSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  questions: z
    .object({
      id: z.number().nullable(),
      title: z.string(),
      description: z.string(),
      question_type: z.enum(['TEXT', 'SINGLE', 'MULTIPLE']),
      choices: z.object({ choice: z.string() }).array(),
      is_required: z.boolean(),
    })
    .array(),
  settings: z.object({
    has_response_period: z.boolean(),
    response_period: z
      .object({
        start_at: z.string().nullable(),
        end_at: z.string().nullable(),
      })
      .nullable(),
    webhook_url: z.string().nullable(),
    visibility: z.enum(['PUBLIC', 'PRIVATE']),
    default_answer_title: z.string().nullable(),
    answer_visibility: z.enum(['PUBLIC', 'PRIVATE']),
  }),
  metadata: z.object({
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
  }),
});

export type Form = z.infer<typeof formSchema>;

export type Visibility = z.infer<typeof _visibility>;
