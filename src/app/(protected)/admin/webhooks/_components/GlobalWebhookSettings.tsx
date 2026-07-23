'use client';

import SaveAltIcon from '@mui/icons-material/SaveAlt';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import SnackbarAlert, { useSnackbar } from '@/app/_components/SnackbarAlert';
import { useGlobalDiscordWebhook } from '@/hooks/useGlobalDiscordWebhook';
import type { GetGlobalDiscordWebhookResponse } from '@/lib/api-types';

import {
  defaultGlobalWebhookFormValues,
  toGlobalWebhookUpdateUrl,
} from '../_lib/globalWebhookForm';
import type { GlobalWebhookFormValues } from '../_lib/globalWebhookForm';

const GlobalWebhookSettings = ({
  currentStatus,
}: {
  currentStatus: GetGlobalDiscordWebhookResponse;
}) => {
  const [enabled, setEnabled] = useState(currentStatus.enabled);
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<GlobalWebhookFormValues>({
    defaultValues: defaultGlobalWebhookFormValues,
  });

  const { updateWebhook } = useGlobalDiscordWebhook();
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

  const onSubmit = async (data: GlobalWebhookFormValues) => {
    const url = toGlobalWebhookUpdateUrl(data);
    const result = await updateWebhook(url);
    if (result.ok) {
      setEnabled(url !== null);
      reset(defaultGlobalWebhookFormValues);
      showSnackbar(
        url !== null ? 'Webhook を設定しました' : 'Webhook を無効化しました',
        'success'
      );
    } else {
      showSnackbar('Webhook 設定の更新に失敗しました', 'error');
    }
  };

  return (
    <Card sx={{ maxWidth: 600 }}>
      <CardContent
        component="form"
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
      >
        <Stack spacing={1} direction="row" sx={{ alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="h2">
            グローバル Discord Webhook
          </Typography>
          <Chip
            label={enabled ? '有効' : '無効'}
            color={enabled ? 'success' : 'default'}
            size="small"
          />
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            すべてのフォームの通知をまとめて送信する Discord Webhook
            です。セキュリティのため設定済みの URL
            は再表示されません。空欄のまま保存すると通知を無効化します。
          </Typography>
          <Controller
            name="url"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Discord Webhook URL"
                placeholder="https://discord.com/api/webhooks/..."
                fullWidth
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
    </Card>
  );
};

export default GlobalWebhookSettings;
