import type { UpdateNotificationSettingsSchema } from '@/lib/api-types';

type NotificationSettingsResponseInput = {
  is_send_message_notification?: boolean | null;
};

export type NotificationSettingsFormValues = {
  isSendMessageNotificationEnabled: boolean;
};

export const fromNotificationSettingsResponseToFormValues = (
  settings: NotificationSettingsResponseInput
): NotificationSettingsFormValues => ({
  isSendMessageNotificationEnabled:
    settings.is_send_message_notification ?? false,
});

export const toNotificationSettingsUpdateBody = (
  values: NotificationSettingsFormValues
): UpdateNotificationSettingsSchema => ({
  is_send_message_notification: values.isSendMessageNotificationEnabled,
});
