'use client';

import * as sdk from '@/generated/api/sdk.gen';
import type * as Api from '@/generated/api/types.gen';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import { withResponse } from '@/lib/api/createApiClient';
import { proxyClient } from '@/lib/proxyClient';

type NotificationSettingsUpdateBody = NonNullable<
  Api.UpdateNotificationSettingsData['body']
>;

export const useNotificationSettings = () => {
  const updateSettings = async (
    data: NotificationSettingsUpdateBody
  ): Promise<{ ok: boolean }> => {
    const { response } = await withResponse(
      sdk.updateNotificationSettings({
        client: proxyClient,
        body: data,
      })
    );
    return { ok: response.ok };
  };

  return { updateSettings: useSingleFlightAction(updateSettings) };
};
