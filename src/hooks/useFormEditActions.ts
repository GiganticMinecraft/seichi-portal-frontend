'use client';

import { proxyClient } from '@/lib/proxyClient';
import { handleMutationResponse } from '@/hooks/useApiMutation';
import type { ApiPaths } from '@/lib/api/types';

type FormUpdateBody =
  ApiPaths['/api/v1/forms/{id}']['put']['requestBody']['content']['application/json'];

export const useFormEditActions = (formId: string) => {
  const updateForm = async (body: FormUpdateBody): Promise<{ ok: boolean }> => {
    const { data, error, response } = await proxyClient.PUT(
      '/api/v1/forms/{id}',
      {
        params: { path: { id: formId } },
        body,
      }
    );
    const result = handleMutationResponse(response, data, error);
    return { ok: result.success };
  };

  return { updateForm };
};
