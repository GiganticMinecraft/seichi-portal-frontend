'use client';

import { proxyClient } from '@/lib/proxyClient';
import { handleMutationResponse } from '@/hooks/useApiMutation';

export const useFormActions = () => {
  const deleteForm = async (formId: string): Promise<{ ok: boolean }> => {
    const { data, response } = await proxyClient.DELETE('/forms/{id}', {
      params: { path: { id: formId } },
    });
    const result = await handleMutationResponse(response, data);
    return { ok: result.success };
  };

  return { deleteForm };
};
