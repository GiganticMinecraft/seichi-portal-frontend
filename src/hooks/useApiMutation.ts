'use client';

import { z } from 'zod';
import { errorResponseSchema } from '@/lib/api/errors';
import type { ErrorResponse } from '@/lib/api/errors';

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

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- schema 未指定時、data は unknown だが呼び出し元が T を保証する前提の設計
  return { success: true, data: data as T };
};
