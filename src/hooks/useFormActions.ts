'use client';

import { handleMutationResponse } from '@/hooks/useApiMutation';
import { proxyClient } from '@/lib/proxyClient';

export const useFormActions = () => {
  const archiveForm = async (formId: string): Promise<{ ok: boolean }> => {
    const { data, error, response } = await proxyClient.POST(
      '/api/v1/forms/{id}/archive',
      {
        params: { path: { id: formId } },
      }
    );
    const result = handleMutationResponse(response, data, error);
    return { ok: result.success };
  };

  const restoreForm = async (formId: string): Promise<{ ok: boolean }> => {
    const { data, error, response } = await proxyClient.POST(
      '/api/v1/archived-forms/{id}/restore',
      {
        params: { path: { id: formId } },
      }
    );
    const result = handleMutationResponse(response, data, error);
    return { ok: result.success };
  };

  return { archiveForm, restoreForm };
};
