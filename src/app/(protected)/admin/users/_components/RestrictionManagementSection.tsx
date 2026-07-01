'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useApiQuery } from '@/app/_swr/useApiQuery';
import { formatString } from '@/generic/DateFormatter';
import { useAnswerSubmitterRestrictionActions } from '@/hooks/useAnswerSubmitterRestrictionActions';
import {
  formatRestrictionExpiration,
  toRestrictionExpiration,
} from '@/lib/restrictions/expiration';

import { restrictionFormSchema, toRestrictionRequest } from './restrictionForm';
import type {
  RestrictionFormExpiration,
  RestrictionFormInput,
  RestrictionFormValues,
} from './restrictionForm';

const RestrictionManagementSection = ({
  uuid,
  disabled,
}: {
  uuid: string;
  disabled: boolean;
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data, error, isLoading, mutate } = useApiQuery(
    '/api/v1/users/{uuid}/answer-submitter-restriction',
    { path: { uuid } }
  );

  const { restrictUser, unrestrictUser } =
    useAnswerSubmitterRestrictionActions();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RestrictionFormInput, unknown, RestrictionFormValues>({
    resolver: zodResolver(restrictionFormSchema),
    defaultValues: { reason: '', expiration: { kind: 'indefinite' } },
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">制限状態の取得に失敗しました。</Alert>;
  }

  // 既に制限中: 現在の内容を表示し、解除のみ行える。
  if (data) {
    const expiration = toRestrictionExpiration(data.expires_at);

    const onUnrestrict = async () => {
      setSubmitError(null);
      const result = await unrestrictUser(uuid);
      if (result.success) {
        await mutate();
      } else {
        setSubmitError('制限の解除に失敗しました。');
      }
    };

    return (
      <Stack spacing={1.5}>
        {submitError && <Alert severity="error">{submitError}</Alert>}
        <Stack spacing={0.5}>
          <Typography component="p">
            <strong>理由:</strong> {data.reason}
          </Typography>
          <Typography component="p">
            <strong>制限日時:</strong> {formatString(data.restricted_at)}
          </Typography>
          <Typography component="p">
            <strong>解除予定:</strong> {formatRestrictionExpiration(expiration)}
          </Typography>
        </Stack>
        <Tooltip
          title={disabled ? '自分自身は制限できません' : ''}
          placement="top"
        >
          <span>
            <Button
              color="error"
              variant="outlined"
              size="small"
              disabled={disabled}
              onClick={() => {
                void onUnrestrict();
              }}
            >
              制限を解除する
            </Button>
          </span>
        </Tooltip>
      </Stack>
    );
  }

  // 未制限: 制限を付与するフォームを表示する。
  const onRestrict = async (values: RestrictionFormValues) => {
    setSubmitError(null);
    const result = await restrictUser(uuid, toRestrictionRequest(values));
    if (result.success) {
      await mutate();
    } else {
      setSubmitError('制限の付与に失敗しました。');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form
        onSubmit={(e) => {
          void handleSubmit(onRestrict)(e);
        }}
      >
        <Stack spacing={2}>
          {submitError && <Alert severity="error">{submitError}</Alert>}
          <Controller
            name="reason"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="理由"
                required
                multiline
                minRows={2}
                fullWidth
                size="small"
                disabled={disabled}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="expiration"
            control={control}
            render={({ field, fieldState }) => (
              <DateTimePicker
                label="解除予定日時（任意・未指定で無期限）"
                value={
                  field.value.kind === 'expiresAt'
                    ? field.value.expiresAt
                    : null
                }
                onChange={(value) => {
                  const expiration: RestrictionFormExpiration =
                    value == null
                      ? { kind: 'indefinite' }
                      : { kind: 'expiresAt', expiresAt: value };
                  field.onChange(expiration);
                }}
                disabled={disabled}
                slotProps={{
                  field: { clearable: true },
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    error: Boolean(fieldState.error),
                    helperText: fieldState.error?.message,
                  },
                }}
              />
            )}
          />
          <Tooltip
            title={disabled ? '自分自身は制限できません' : ''}
            placement="top"
          >
            <span>
              <Button
                type="submit"
                color="error"
                variant="outlined"
                size="small"
                disabled={disabled || isSubmitting}
              >
                制限する
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </form>
    </LocalizationProvider>
  );
};

export default RestrictionManagementSection;
