'use client';

import SaveAltIcon from '@mui/icons-material/SaveAlt';
import {
  Button,
  CardContent,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { Controller, useForm } from 'react-hook-form';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import {
  fromNotificationSettingsResponseToFormValues,
  toNotificationSettingsUpdateBody,
} from './notificationSettingsForm';
import type { GetUserNotificationSettingsResponse } from '@/lib/api-types';
import type { NotificationSettingsFormValues } from './notificationSettingsForm';

const DiscordNotificationSettings = (props: {
  currentSettings: GetUserNotificationSettingsResponse;
  userId: string;
}) => {
  const { handleSubmit, control } = useForm<NotificationSettingsFormValues>({
    defaultValues: fromNotificationSettingsResponseToFormValues(
      props.currentSettings
    ),
  });

  const { updateSettings } = useNotificationSettings();

  const onSubmit = async (data: NotificationSettingsFormValues) => {
    const result = await updateSettings(toNotificationSettingsUpdateBody(data));
    if (result.ok) {
      alert('設定を更新しました');
    } else {
      alert('通知設定の更新に失敗しました');
    }
  };

  return (
    <CardContent component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6" gutterBottom>
        通知設定
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2}>
        <Controller
          name="isSendMessageNotificationEnabled"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              label="自身の回答に対するメッセージ通知を受け取る"
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(_, checked) => field.onChange(checked)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              }
            />
          )}
        />
        <Button
          variant="contained"
          endIcon={<SaveAltIcon />}
          type="submit"
          sx={{ alignSelf: 'flex-start' }}
        >
          保存
        </Button>
      </Stack>
    </CardContent>
  );
};

export default DiscordNotificationSettings;
