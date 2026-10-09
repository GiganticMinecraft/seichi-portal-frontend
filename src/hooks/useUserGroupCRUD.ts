'use client';

import { useSWRConfig } from 'swr';

import * as sdk from '@/generated/api/sdk.gen';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import { withResponse } from '@/lib/api/createApiClient';
import { proxyClient } from '@/lib/proxyClient';

export const useUserGroupCRUD = () => {
  const { mutate } = useSWRConfig();
  const key = ['/api/v1/user-groups'];

  const createGroup = async (name: string): Promise<{ ok: boolean }> => {
    const { response } = await withResponse(
      sdk.createUserGroup({
        client: proxyClient,
        body: { name },
      })
    );
    if (response.ok) await mutate(key);
    return { ok: response.ok };
  };

  const editGroup = async (
    id: string,
    name: string
  ): Promise<{ ok: boolean }> => {
    const { response } = await withResponse(
      sdk.updateUserGroup({
        client: proxyClient,
        path: { group_id: id },
        body: { name },
      })
    );
    if (response.ok) await mutate(key);
    return { ok: response.ok };
  };

  const deleteGroup = async (id: string): Promise<{ ok: boolean }> => {
    const { response } = await withResponse(
      sdk.deleteUserGroup({
        client: proxyClient,
        path: { group_id: id },
      })
    );
    if (response.ok) await mutate(key);
    return { ok: response.ok };
  };

  return {
    createGroup: useSingleFlightAction(createGroup),
    editGroup: useSingleFlightAction(editGroup),
    deleteGroup: useSingleFlightAction(deleteGroup),
  };
};
