import { describe, expect, it } from 'vitest';

import {
  fromNotificationSettingsResponseToFormValues,
  toNotificationSettingsUpdateBody,
} from '@/app/(protected)/(standard)/users/[userId]/_components/notificationSettingsForm';

describe('notification settings form mappers', () => {
  it('API response を boolean のフォーム値へ変換する', () => {
    expect(
      fromNotificationSettingsResponseToFormValues({
        is_send_message_notification: true,
      })
    ).toEqual({ isSendMessageNotificationEnabled: true });
  });

  it('API response の通知設定が欠けていても false に正規化する', () => {
    expect(
      fromNotificationSettingsResponseToFormValues({
        is_send_message_notification: null,
      })
    ).toEqual({ isSendMessageNotificationEnabled: false });
    expect(fromNotificationSettingsResponseToFormValues({})).toEqual({
      isSendMessageNotificationEnabled: false,
    });
  });

  it('フォーム値を nullable ではない更新 body へ変換する', () => {
    expect(
      toNotificationSettingsUpdateBody({
        isSendMessageNotificationEnabled: false,
      })
    ).toEqual({ is_send_message_notification: false });
  });
});
