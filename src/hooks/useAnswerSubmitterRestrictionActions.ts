'use client';

import { proxyClient } from '@/lib/proxyClient';
import { handleMutationResponse } from '@/hooks/useApiMutation';
import type { MutationResult } from '@/hooks/useApiMutation';
import type { PutAnswerSubmitterRestrictionSchema } from '@/lib/api-types';

export const useAnswerSubmitterRestrictionActions = () => {
  const restrictUser = async (
    uuid: string,
    body: PutAnswerSubmitterRestrictionSchema
  ): Promise<MutationResult<unknown>> => {
    const { data, error, response } = await proxyClient.PUT(
      '/api/v1/users/{uuid}/answer-submitter-restriction',
      {
        params: { path: { uuid } },
        body,
      }
    );
    return handleMutationResponse(response, data, error);
  };

  const unrestrictUser = async (
    uuid: string
  ): Promise<MutationResult<unknown>> => {
    const { data, error, response } = await proxyClient.DELETE(
      '/api/v1/users/{uuid}/answer-submitter-restriction',
      {
        params: { path: { uuid } },
      }
    );
    return handleMutationResponse(response, data, error);
  };

  return { restrictUser, unrestrictUser };
};
