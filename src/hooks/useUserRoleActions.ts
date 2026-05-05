'use client';

import { proxyClient } from '@/lib/proxyClient';
import { handleMutationResponse } from '@/hooks/useApiMutation';

export const useUserRoleActions = () => {
  const updateUserRole = async (uuid: string, role: string): Promise<void> => {
    const { data, response } = await proxyClient.PATCH('/users/{uuid}', {
      params: { path: { uuid } },
      body: { role },
    });
    await handleMutationResponse(response, data);
  };

  return { updateUserRole };
};
