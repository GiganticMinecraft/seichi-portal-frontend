'use client';

import { errorResponseSchema } from '@/lib/api-types';

type MessageActionResult = { success: boolean; forbidden?: boolean };

export const useMessageActions = (answerId: number) => {
  const updateMessage = async (
    messageId: string,
    body: string
  ): Promise<MessageActionResult> => {
    const response = await fetch(
      `/api/proxy/forms/answers/${answerId}/messages/${messageId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      }
    );

    if (response.ok) {
      return { success: true };
    }

    const parseResult = errorResponseSchema.safeParse(await response.json());
    if (parseResult.success && parseResult.data.errorCode === 'FORBIDDEN') {
      return { success: false, forbidden: true };
    }
    return { success: false };
  };

  const deleteMessage = async (
    messageId: string
  ): Promise<MessageActionResult> => {
    const response = await fetch(
      `/api/proxy/forms/answers/${answerId}/messages/${messageId}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response.ok) {
      return { success: true };
    }

    const parseResult = errorResponseSchema.safeParse(await response.json());
    if (parseResult.success && parseResult.data.errorCode === 'FORBIDDEN') {
      return { success: false, forbidden: true };
    }
    return { success: false };
  };

  return { updateMessage, deleteMessage };
};
