'use client';

export const useSendMessage = (answerId: number) => {
  const sendMessage = async (body: string): Promise<{ ok: boolean }> => {
    const response = await fetch(
      `/api/proxy/forms/answers/${answerId}/messages`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      }
    );
    return { ok: response.ok };
  };

  return { sendMessage };
};
