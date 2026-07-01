'use client';

import { useSWRConfig } from 'swr';

import { proxyClient } from '@/lib/proxyClient';

export const useUserGroupCRUD = () => {
  const { mutate } = useSWRConfig();
  const key = ['/api/v1/user-groups'];

  const createGroup = async (name: string): Promise<{ ok: boolean }> => {
    const { response } = await proxyClient.POST('/api/v1/user-groups', {
      body: { name },
    });
    if (response.ok) await mutate(key);
    return { ok: response.ok };
  };

  const editGroup = async (
    id: string,
    name: string
  ): Promise<{ ok: boolean }> => {
    const { response } = await proxyClient.PATCH(
      '/api/v1/user-groups/{group_id}',
      {
        params: { path: { group_id: id } },
        body: { name },
      }
    );
    if (response.ok) await mutate(key);
    return { ok: response.ok };
  };

  const deleteGroup = async (id: string): Promise<{ ok: boolean }> => {
    const { response } = await proxyClient.DELETE(
      '/api/v1/user-groups/{group_id}',
      {
        params: { path: { group_id: id } },
      }
    );
    if (response.ok) await mutate(key);
    return { ok: response.ok };
  };

  return { createGroup, editGroup, deleteGroup };
};
