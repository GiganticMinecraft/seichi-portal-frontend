'use client';

import { proxyClient } from '@/lib/proxyClient';

export const useFormActions = () => {
  const deleteForm = async (formId: string): Promise<{ ok: boolean }> => {
    const { response } = await proxyClient.DELETE('/forms/{id}', {
      params: { path: { id: formId } },
    });
    return { ok: response.ok };
  };

  return { deleteForm };
};
