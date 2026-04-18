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
import type {
  GetNotificationSettingsResponse,
  UpdateNotificationSettingsSchema,
} from '@/lib/api-types';

const DiscordNotificationSettings = (props: {
  currentSettings: GetNotificationSettingsResponse;
  userId: string;
}) => {
  const { handleSubmit, register, control } =
    useForm<UpdateNotificationSettingsSchema>({
      defaultValues: {
        recipient_id: props.userId,
        is_send_message_notification:
          props.currentSettings.is_send_message_notification,
      },
    });

  const { updateSettings } = useNotificationSettings();

  const onSubmit = async (data: UpdateNotificationSettingsSchema) => {
    const result = await updateSettings({
      is_send_message_notification: data.is_send_message_notification ?? null,
    });
    if (result.ok) {
      alert('設定を更新しました');
    } else {
      alert('通知設定の更新に失敗しました');
    }
  };

  return (
    <CardContent component="form" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register('recipient_id')} />
      <Typography variant="h6" gutterBottom>
        通知設定
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2}>
        <Controller
          name="is_send_message_notification"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              label="自身の回答に対するメッセージ通知を受け取る"
              control={
                <Checkbox
                  checked={field.value ?? false}
                  onChange={field.onChange}
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
