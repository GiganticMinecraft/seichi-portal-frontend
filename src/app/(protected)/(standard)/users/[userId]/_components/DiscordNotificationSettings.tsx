'use client';

import SaveAltIcon from '@mui/icons-material/SaveAlt';
import {
  Alert,
  Button,
  CardContent,
  Divider,
  FormControlLabel,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import type { GetUserNotificationSettingsResponse } from '@/lib/api-types';

import {
  fromNotificationSettingsResponseToFormValues,
  toNotificationSettingsUpdateBody,
} from './notificationSettingsForm';
import type { NotificationSettingsFormValues } from './notificationSettingsForm';

type SnackbarState = {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
};

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

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const onSubmit = async (data: NotificationSettingsFormValues) => {
    const result = await updateSettings(toNotificationSettingsUpdateBody(data));
    if (result.ok) {
      setSnackbar({
        open: true,
        message: '設定を更新しました',
        severity: 'success',
      });
    } else {
      setSnackbar({
        open: true,
        message: '通知設定の更新に失敗しました',
        severity: 'error',
      });
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
          >
            保存
          </Button>
        </Stack>
      </CardContent>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={(_, reason) => {
          if (reason !== 'clickaway')
            setSnackbar((prev) => ({ ...prev, open: false }));
        }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => {
            setSnackbar((prev) => ({ ...prev, open: false }));
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DiscordNotificationSettings;
