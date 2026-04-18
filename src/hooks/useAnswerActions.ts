'use client';

export const useAnswerActions = (answerId: number | string) => {
  const updateTitle = async (title: string): Promise<{ ok: boolean }> => {
    const response = await fetch(`/api/proxy/forms/answers/${answerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    return { ok: response.ok };
  };

  const updateLabels = async (labelIds: (string | number)[]) => {
    await fetch(`/api/proxy/forms/answers/${answerId}/labels`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ labels: labelIds }),
    });
  };

  return { updateTitle, updateLabels };
};
