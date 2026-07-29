'use client';

import { handleMutationResponse } from '@/hooks/useApiMutation';
import type { MutationResult } from '@/hooks/useApiMutation';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import type { PutFormSubmissionRestrictionSchema } from '@/lib/api-types';
import { proxyClient } from '@/lib/proxyClient';

export const useFormSubmissionRestrictionActions = () => {
  const restrictUser = async (
    uuid: string,
    body: PutFormSubmissionRestrictionSchema
  ): Promise<MutationResult> => {
    const { data, error, response } = await proxyClient.PUT(
      '/api/v1/users/{uuid}/form-submission-restriction',
      {
        params: { path: { uuid } },
        body,
      }
    );
    return handleMutationResponse(response, data, error);
  };

  const unrestrictUser = async (uuid: string): Promise<MutationResult> => {
    const { data, error, response } = await proxyClient.DELETE(
      '/api/v1/users/{uuid}/form-submission-restriction',
      {
        params: { path: { uuid } },
      }
    );
    return handleMutationResponse(response, data, error);
  };

  return {
    restrictUser: useSingleFlightAction(restrictUser),
    unrestrictUser: useSingleFlightAction(unrestrictUser),
  };
};
