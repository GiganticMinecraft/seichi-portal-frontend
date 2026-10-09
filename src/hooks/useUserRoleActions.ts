'use client';

import * as sdk from '@/generated/api/sdk.gen';
import { handleMutationResponse } from '@/hooks/useApiMutation';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import { withResponse } from '@/lib/api/createApiClient';
import { proxyClient } from '@/lib/proxyClient';

export const useUserRoleActions = () => {
  const updateUserRole = async (uuid: string, role: string): Promise<void> => {
    const { data, error, response } = await withResponse(
      sdk.patchUserRole({
        client: proxyClient,
        path: { uuid },
        body: { role },
      })
    );
    handleMutationResponse(response, data, error);
  };

  return { updateUserRole: useSingleFlightAction(updateUserRole) };
};
