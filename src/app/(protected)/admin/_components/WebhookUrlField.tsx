'use client';

import { Button, Chip, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { match } from 'ts-pattern';

import FieldLabel from '@/app/_components/FieldLabel';

type WebhookUrlFieldProps = {
  label?: string;
  enabled: boolean;
  value: string;
  onChange: (value: string) => void;
  isPendingDelete: boolean;
  onPendingDeleteChange: (isPendingDelete: boolean) => void;
};

const WebhookUrlField = ({
  label = 'Webhook URL',
  enabled,
  value,
  onChange,
  isPendingDelete,
  onPendingDeleteChange,
}: WebhookUrlFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const hasPendingValue = value.trim() !== '';

  const { chipLabel, chipColor } = match({
    isPendingDelete,
    hasPendingValue,
    enabled,
  })
    .with({ isPendingDelete: true }, () => ({
      chipLabel: '削除予定',
      chipColor: 'error' as const,
    }))
    .with({ hasPendingValue: true }, () => ({
      chipLabel: '変更予定',
      chipColor: 'info' as const,
    }))
    .with({ enabled: true }, () => ({
      chipLabel: '設定済み',
      chipColor: 'success' as const,
    }))
    .otherwise(() => ({ chipLabel: '未設定', chipColor: 'default' as const }));

  const cancelEditing = () => {
    onChange('');
    setIsEditing(false);
  };

  return (
    <Stack spacing={0.5}>
      <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
        <FieldLabel label={label} />
        <Chip label={chipLabel} color={chipColor} size="small" />
      </Stack>

      {match({ isPendingDelete, isEditing })
        .with({ isPendingDelete: true }, () => (
          <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
            <Typography variant="caption" color="textSecondary">
              保存すると Webhook 設定を削除します。
            </Typography>
            <Button
              size="small"
              onClick={() => {
                onPendingDeleteChange(false);
              }}
            >
              取り消す
            </Button>
          </Stack>
        ))
        .with({ isEditing: true }, () => (
          <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
            <TextField
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
              }}
              type="url"
              autoFocus
              fullWidth
              helperText="新しく設定する Webhook URL を入力してください。"
              slotProps={{ htmlInput: { 'aria-label': label } }}
            />
            <Button size="small" onClick={cancelEditing}>
              キャンセル
            </Button>
          </Stack>
        ))
        .otherwise(() => (
          <Stack spacing={1} direction="row">
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              変更
            </Button>
            {enabled && (
              <Button
                size="small"
                color="error"
                onClick={() => {
                  onPendingDeleteChange(true);
                }}
              >
                削除
              </Button>
            )}
          </Stack>
        ))}
    </Stack>
  );
};

export default WebhookUrlField;
