'use client';

import { Button, Chip, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

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

  const chipLabel = isPendingDelete
    ? '削除予定'
    : hasPendingValue
      ? '変更予定'
      : enabled
        ? '設定済み'
        : '未設定';
  const chipColor = isPendingDelete
    ? 'error'
    : hasPendingValue
      ? 'info'
      : enabled
        ? 'success'
        : 'default';

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

      {isPendingDelete ? (
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
      ) : isEditing ? (
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
      ) : (
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
      )}
    </Stack>
  );
};

export default WebhookUrlField;
