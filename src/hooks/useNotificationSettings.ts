'use client';

import type { ApiPaths } from '@/lib/api/types';
import { proxyClient } from '@/lib/proxyClient';

type NotificationSettingsUpdateBody =
  ApiPaths['/api/v1/notifications/settings/me']['patch']['requestBody']['content']['application/json'];

export const useNotificationSettings = () => {
  const updateSettings = async (
    data: NotificationSettingsUpdateBody
  ): Promise<{ ok: boolean }> => {
    const { response } = await proxyClient.PATCH(
      '/api/v1/notifications/settings/me',
      {
        body: data,
      }
    );
    return { ok: response.ok };
  };

  return { updateSettings };
};
