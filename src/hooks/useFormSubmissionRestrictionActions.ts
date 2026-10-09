'use client';

import * as sdk from '@/generated/api/sdk.gen';
import { handleMutationResponse } from '@/hooks/useApiMutation';
import type { MutationResult } from '@/hooks/useApiMutation';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import { withResponse } from '@/lib/api/createApiClient';
import type { PutFormSubmissionRestrictionSchema } from '@/lib/api-types';
import { proxyClient } from '@/lib/proxyClient';

export const useFormSubmissionRestrictionActions = () => {
  const restrictUser = async (
    uuid: string,
    body: PutFormSubmissionRestrictionSchema
  ): Promise<MutationResult> => {
    const { data, error, response } = await withResponse(
      sdk.putFormSubmissionRestriction({
        client: proxyClient,
        path: { uuid },
        body,
      })
    );
    return handleMutationResponse(response, data, error);
  };

  const unrestrictUser = async (uuid: string): Promise<MutationResult> => {
    const { data, error, response } = await withResponse(
      sdk.deleteFormSubmissionRestriction({
        client: proxyClient,
        path: { uuid },
      })
    );
    return handleMutationResponse(response, data, error);
  };

  return {
    restrictUser: useSingleFlightAction(restrictUser),
    unrestrictUser: useSingleFlightAction(unrestrictUser),
  };
};
