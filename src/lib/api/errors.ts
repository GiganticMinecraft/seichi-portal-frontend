import { z } from 'zod';
import type { components } from '@/generated/api-types';

export const errorResponseSchema = z.object({
  detail: z.string(),
  errorCode: z.string(),
  status: z.number(),
  title: z.string(),
  type: z.string(),
});

export type ErrorResponse = components['schemas']['ErrorResponse'];

export const parseErrorResponse = (error: unknown) =>
  errorResponseSchema.safeParse(error);
