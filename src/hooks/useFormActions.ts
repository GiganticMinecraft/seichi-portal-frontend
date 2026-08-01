'use client';

import { handleMutationResponse } from '@/hooks/useApiMutation';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import { proxyClient } from '@/lib/proxyClient';

export const useFormActions = () => {
  const archiveForm = async (formId: string): Promise<{ ok: boolean }> => {
    const { data, error, response } = await proxyClient.POST(
      '/api/v1/forms/{form_id}/archive',
      {
        params: { path: { form_id: formId } },
      }
    );
    const result = handleMutationResponse(response, data, error);
    return { ok: result.success };
  };

  const restoreForm = async (formId: string): Promise<{ ok: boolean }> => {
    const { data, error, response } = await proxyClient.POST(
      '/api/v1/archived-forms/{form_id}/restore',
      {
        params: { path: { form_id: formId } },
      }
    );
    const result = handleMutationResponse(response, data, error);
    return { ok: result.success };
  };

  return {
    archiveForm: useSingleFlightAction(archiveForm),
    restoreForm: useSingleFlightAction(restoreForm),
  };
};
