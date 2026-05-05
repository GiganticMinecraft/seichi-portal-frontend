'use client';

import { proxyClient } from '@/lib/proxyClient';
import { handleMutationResponse } from '@/hooks/useApiMutation';

export const useFormActions = () => {
  const deleteForm = async (formId: string): Promise<{ ok: boolean }> => {
    const { data, error, response } = await proxyClient.DELETE('/forms/{id}', {
      params: { path: { id: formId } },
    });
    const result = handleMutationResponse(response, data, error);
    return { ok: result.success };
  };

  return { deleteForm };
};
