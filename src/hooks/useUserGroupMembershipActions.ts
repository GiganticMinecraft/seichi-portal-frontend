'use client';

import { handleMutationResponse } from '@/hooks/useApiMutation';
import type { MutationResult } from '@/hooks/useApiMutation';
import { proxyClient } from '@/lib/proxyClient';

export const useUserGroupMembershipActions = () => {
  const addUserToGroup = async (
    groupId: string,
    userId: string
  ): Promise<MutationResult> => {
    const { data, error, response } = await proxyClient.PUT(
      '/api/v1/user-groups/{group_id}/users/{user_id}',
      {
        params: { path: { group_id: groupId, user_id: userId } },
      }
    );
    return handleMutationResponse(response, data, error);
  };

  const removeUserFromGroup = async (
    groupId: string,
    userId: string
  ): Promise<MutationResult> => {
    const { data, error, response } = await proxyClient.DELETE(
      '/api/v1/user-groups/{group_id}/users/{user_id}',
      {
        params: { path: { group_id: groupId, user_id: userId } },
      }
    );
    return handleMutationResponse(response, data, error);
  };

  return { addUserToGroup, removeUserFromGroup };
};
