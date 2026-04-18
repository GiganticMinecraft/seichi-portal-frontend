'use client';

import { errorResponseSchema } from '@/lib/api-types';

type MessageActionResult = { success: boolean; forbidden?: boolean };

const parseForbidden = async (response: Response): Promise<boolean> => {
  try {
    const json = await response.json();
    const parseResult = errorResponseSchema.safeParse(json);
    return parseResult.success && parseResult.data.errorCode === 'FORBIDDEN';
  } catch {
    return false;
  }
};

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

    const forbidden = await parseForbidden(response);
    return { success: false, forbidden };
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

    const forbidden = await parseForbidden(response);
    return { success: false, forbidden };
  };

  return { updateMessage, deleteMessage };
};
