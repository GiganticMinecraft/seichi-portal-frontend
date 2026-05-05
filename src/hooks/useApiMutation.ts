'use client';

import { z } from 'zod';
import { errorResponseSchema } from '@/lib/api-types';
import type { ErrorResponse } from '@/lib/api-types';

export type MutationResult<T> =
  | { success: true; data: T }
  | { success: false; error?: ErrorResponse; forbidden?: boolean };

const parseForbidden = async (response: Response): Promise<boolean> => {
  try {
    const json = await response.json();
    const parseResult = errorResponseSchema.safeParse(json);
    return parseResult.success && parseResult.data.errorCode === 'FORBIDDEN';
  } catch {
    return false;
  }
};

export const handleMutationResponse = async <T>(
  response: Response,
  data: unknown,
  schema?: z.ZodType<T>
): Promise<MutationResult<T>> => {
  if (!response.ok) {
    const forbidden = await parseForbidden(response);
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
