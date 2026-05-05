'use client';

import { z } from 'zod';
import { errorResponseSchema } from '@/lib/api-types';
import type { ErrorResponse } from '@/lib/api-types';

export type MutationResult<T> =
  | { success: true; data: T }
  | { success: false; error?: ErrorResponse; forbidden?: boolean };

const parseForbidden = (error: unknown): boolean => {
  const parseResult = errorResponseSchema.safeParse(error);
  return parseResult.success && parseResult.data.errorCode === 'FORBIDDEN';
};

export const handleMutationResponse = <T>(
  response: Response,
  data: unknown,
  error: unknown,
  schema?: z.ZodType<T>
): MutationResult<T> => {
  if (!response.ok) {
    const forbidden = parseForbidden(error);
    const errorData = errorResponseSchema.safeParse(error).data;
    if (errorData) {
      return { success: false, forbidden, error: errorData };
    }
    return { success: false, forbidden };
  }

  if (schema) {
    const parseResult = schema.safeParse(data);
    if (!parseResult.success) {
      console.error('Response validation failed:', parseResult.error);
      return { success: false };
    }
    return { success: true, data: parseResult.data };
  }

  return { success: true, data: data as T };
};
