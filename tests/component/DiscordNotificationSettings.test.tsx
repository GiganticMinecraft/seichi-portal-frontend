import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import DiscordNotificationSettings from '@/app/(protected)/(standard)/users/[userId]/_components/DiscordNotificationSettings';
import type {
  GetUserNotificationSettingsResponse,
  UpdateNotificationSettingsSchema,
} from '@/lib/api-types';

import { renderWithProviders, screen, waitFor } from './render';

type NotificationSettingsMocks = {
  updateSettings: ReturnType<
    typeof vi.fn<
      (data: UpdateNotificationSettingsSchema) => Promise<{ ok: boolean }>
    >
  >;
};

const notificationSettingsMocks = vi.hoisted<NotificationSettingsMocks>(() => ({
  updateSettings:
    vi.fn<
      (data: UpdateNotificationSettingsSchema) => Promise<{ ok: boolean }>
    >(),
}));

vi.mock('@/hooks/useNotificationSettings', () => ({
  useNotificationSettings: () => ({
    updateSettings: notificationSettingsMocks.updateSettings,
  }),
}));

const currentSettings = {
  is_send_message_notification: false,
} satisfies GetUserNotificationSettingsResponse;

describe('DiscordNotificationSettings', () => {
  beforeEach(() => {
    notificationSettingsMocks.updateSettings.mockResolvedValue({ ok: true });
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('チェック状態を通知設定更新 body に変換して保存する', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <DiscordNotificationSettings
        currentSettings={currentSettings}
        userId="user-id"
      />
    );

    await user.click(
      screen.getByRole('checkbox', {
        name: '自身の回答に対するメッセージ通知を受け取る',
      })
    );
    await user.click(screen.getByRole('button', { name: '保存' }));

    await waitFor(() => {
      expect(notificationSettingsMocks.updateSettings).toHaveBeenCalledWith({
        is_send_message_notification: true,
      });
    });
    expect(window.alert).toHaveBeenCalledWith('設定を更新しました');
  });
});
