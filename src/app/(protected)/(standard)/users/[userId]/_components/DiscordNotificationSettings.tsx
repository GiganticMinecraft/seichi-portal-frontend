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

import SnackbarAlert, { useSnackbar } from '@/app/_components/SnackbarAlert';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import type { GetUserNotificationSettingsResponse } from '@/lib/api-types';

import {
  fromNotificationSettingsResponseToFormValues,
  toNotificationSettingsUpdateBody,
} from './notificationSettingsForm';
import type { NotificationSettingsFormValues } from './notificationSettingsForm';

const DiscordNotificationSettings = (props: {
  currentSettings: GetUserNotificationSettingsResponse;
  userId: string;
}) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<NotificationSettingsFormValues>({
    defaultValues: fromNotificationSettingsResponseToFormValues(
      props.currentSettings
    ),
  });

  const { updateSettings } = useNotificationSettings();
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

  const onSubmit = async (data: NotificationSettingsFormValues) => {
    const result = await updateSettings(toNotificationSettingsUpdateBody(data));
    if (result.ok) {
      showSnackbar('設定を更新しました', 'success');
    } else {
      showSnackbar('通知設定の更新に失敗しました', 'error');
    }
  };

  return (
    <>
      <CardContent
        component="form"
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
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
                    onChange={(_, checked) => {
                      field.onChange(checked);
                    }}
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
            disabled={isSubmitting}
          >
            保存
          </Button>
        </Stack>
      </CardContent>
      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />
    </>
  );
};

export default DiscordNotificationSettings;
