import { z } from 'zod';

const questionSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  question_type: z.enum(['TEXT', 'SINGLE', 'MULTIPLE']),
  choices: z.array(z.string()),
  is_required: z.boolean(),
});

export const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: questionSchema.array(),
  settings: z.object({
    response_period: z
      .object({
        start_at: z.string(),
        end_at: z.string(),
      })
      .nullable(),
    webhook_url: z.string().nullable(),
    default_answer_title: z.string().nullable(),
    visibility: z.enum(['PUBLIC', 'PRIVATE']),
  }),
});

export type Form = z.infer<typeof formSchema>;
