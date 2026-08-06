'use client';

import SaveAltIcon from '@mui/icons-material/SaveAlt';
import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useController, useForm } from 'react-hook-form';

import WebhookUrlField from '@/app/(protected)/admin/_components/WebhookUrlField';
import SnackbarAlert, { useSnackbar } from '@/app/_components/SnackbarAlert';
import { useGlobalDiscordWebhook } from '@/hooks/useGlobalDiscordWebhook';
import type { GetGlobalDiscordWebhookResponse } from '@/lib/api-types';

import {
  defaultGlobalWebhookFormValues,
  hasGlobalWebhookPendingChange,
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

  const { field: urlField } = useController({ control, name: 'url' });
  const { field: disabledField } = useController({
    control,
    name: 'disabled',
  });
  const hasPendingChange = hasGlobalWebhookPendingChange({
    url: urlField.value,
    disabled: disabledField.value,
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
        <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
          グローバル Discord Webhook
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            すべてのフォームの通知をまとめて送信する Discord Webhook
            です。セキュリティのため設定済みの URL は再表示されません。
          </Typography>
          <WebhookUrlField
            label="Discord Webhook URL"
            enabled={enabled}
            value={urlField.value}
            onChange={urlField.onChange}
            isPendingDelete={disabledField.value}
            onPendingDeleteChange={disabledField.onChange}
          />
          <Button
            variant="contained"
            endIcon={<SaveAltIcon />}
            type="submit"
            sx={{ alignSelf: 'flex-start' }}
            disabled={isSubmitting || !hasPendingChange}
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
