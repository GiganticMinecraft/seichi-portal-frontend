'use client';

import { errorResponseSchema } from '@/lib/api/errors';
import type { ErrorResponse } from '@/lib/api/errors';

export type MutationResult =
  | { success: true; data: unknown }
  | { success: false; error?: ErrorResponse; forbidden?: boolean };

const parseForbidden = (error: unknown): boolean => {
  const parseResult = errorResponseSchema.safeParse(error);
  return parseResult.success && parseResult.data.errorCode === 'FORBIDDEN';
};

export const handleMutationResponse = (
  response: Response,
  data: unknown,
  error: unknown
): MutationResult => {
  if (!response.ok) {
    const forbidden = parseForbidden(error);
    const errorData = errorResponseSchema.safeParse(error).data;
    if (errorData) {
      return { success: false, forbidden, error: errorData };
    }
    return { success: false, forbidden };
  }

  return { success: true, data };
};
