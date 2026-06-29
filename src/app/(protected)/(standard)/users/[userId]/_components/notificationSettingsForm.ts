import type {
  GetUserNotificationSettingsResponse,
  UpdateNotificationSettingsSchema,
} from '@/lib/api-types';

export type NotificationSettingsFormValues = {
  isSendMessageNotificationEnabled: boolean;
};

export const fromNotificationSettingsResponseToFormValues = (
  settings: GetUserNotificationSettingsResponse
): NotificationSettingsFormValues => ({
  isSendMessageNotificationEnabled: settings.is_send_message_notification,
});

export const toNotificationSettingsUpdateBody = (
  values: NotificationSettingsFormValues
): UpdateNotificationSettingsSchema => ({
  is_send_message_notification: values.isSendMessageNotificationEnabled,
});
