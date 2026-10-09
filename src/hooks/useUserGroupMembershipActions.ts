'use client';

import * as sdk from '@/generated/api/sdk.gen';
import { handleMutationResponse } from '@/hooks/useApiMutation';
import type { MutationResult } from '@/hooks/useApiMutation';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import { withResponse } from '@/lib/api/createApiClient';
import { proxyClient } from '@/lib/proxyClient';

export const useUserGroupMembershipActions = () => {
  const addUserToGroup = async (
    groupId: string,
    userId: string
  ): Promise<MutationResult> => {
    const { data, error, response } = await withResponse(
      sdk.addUserToGroup({
        client: proxyClient,
        path: { group_id: groupId, user_id: userId },
      })
    );
    return handleMutationResponse(response, data, error);
  };

  const removeUserFromGroup = async (
    groupId: string,
    userId: string
  ): Promise<MutationResult> => {
    const { data, error, response } = await withResponse(
      sdk.removeUserFromGroup({
        client: proxyClient,
        path: { group_id: groupId, user_id: userId },
      })
    );
    return handleMutationResponse(response, data, error);
  };

  return {
    addUserToGroup: useSingleFlightAction(addUserToGroup),
    removeUserFromGroup: useSingleFlightAction(removeUserFromGroup),
  };
};
