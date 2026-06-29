'use client';

import { handleMutationResponse } from '@/hooks/useApiMutation';
import { proxyClient } from '@/lib/proxyClient';

export const useUserRoleActions = () => {
  const updateUserRole = async (uuid: string, role: string): Promise<void> => {
    const { data, error, response } = await proxyClient.PATCH(
      '/api/v1/users/{uuid}',
      {
        params: { path: { uuid } },
        body: { role },
      }
    );
    handleMutationResponse(response, data, error);
  };

  return { updateUserRole };
};
