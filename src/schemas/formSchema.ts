import { z } from 'zod';

export const questionSchema = z.object({
    questionTitle: z.string(),
    questionescription: z.string(),
    questionType: z.string(),
    choices: z.array(z.enum(['SINGLE', 'MULTIPLE'])),
});

export const formSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.object({
        description: z.string(),
    }),
    questions: questionSchema.array(),
});

export const formsSchema = z.array(formSchema);

export type Form = z.infer<typeof formSchema>;
