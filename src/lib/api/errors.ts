import { z } from 'zod';

export const errorRestrictionSchema = z.object({
  reason: z.string(),
  expires_at: z.string().nullable().optional(),
});

export const errorResponseSchema = z.object({
  detail: z.string(),
  errorCode: z.string(),
  status: z.number(),
  title: z.string(),
  type: z.string(),
  restriction: errorRestrictionSchema.nullable().optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type ErrorRestriction = z.infer<typeof errorRestrictionSchema>;

export const parseErrorResponse = (error: unknown) =>
  errorResponseSchema.safeParse(error);
