'use client';

import { proxyClient } from '@/lib/proxyClient';

export const useUserRoleActions = () => {
  const updateUserRole = async (uuid: string, role: string) => {
    await proxyClient.PATCH('/users/{uuid}', {
      params: { path: { uuid } },
      body: { role },
    });
  };

  return { updateUserRole };
};
