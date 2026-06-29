'use client';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { formatString } from '@/generic/DateFormatter';
import { useAnswerSubmitterRestrictionActions } from '@/hooks/useAnswerSubmitterRestrictionActions';
import {
  formatRestrictionExpiration,
  toRestrictionExpiration,
} from '@/lib/restrictions/expiration';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import { restrictionFormSchema, toRestrictionRequest } from './restrictionForm';
import type {
  RestrictionFormExpiration,
  RestrictionFormInput,
  RestrictionFormValues,
} from './restrictionForm';

const RestrictionDialogBody = ({
  uuid,
  onClose,
}: {
  uuid: string;
  onClose: () => void;
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
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </DialogContent>
    );
  }

  if (error) {
    return (
      <DialogContent>
        <Alert severity="error">制限状態の取得に失敗しました。</Alert>
      </DialogContent>
    );
  }

  // 既に制限中: 現在の内容を表示し、解除のみ行える。
  if (data) {
    const expiration = toRestrictionExpiration(data.expires_at);

    const onUnrestrict = async () => {
      setSubmitError(null);
      const result = await unrestrictUser(uuid);
      if (result.success) {
        await mutate();
        onClose();
      } else {
        setSubmitError('制限の解除に失敗しました。');
      }
    };

    return (
      <>
        <DialogContent>
          <Stack spacing={2}>
            {submitError && <Alert severity="error">{submitError}</Alert>}
            <Stack spacing={1}>
              <Typography component="p">
                <strong>理由:</strong> {data.reason}
              </Typography>
              <Typography component="p">
                <strong>制限日時:</strong> {formatString(data.restricted_at)}
              </Typography>
              <Typography component="p">
                <strong>解除予定:</strong>{' '}
                {formatRestrictionExpiration(expiration)}
              </Typography>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>閉じる</Button>
          <Button color="error" variant="contained" onClick={onUnrestrict}>
            制限を解除する
          </Button>
        </DialogActions>
      </>
    );
  }

  // 未制限: 制限を付与するフォームを表示する。
  const onRestrict = async (values: RestrictionFormValues) => {
    setSubmitError(null);
    const result = await restrictUser(uuid, toRestrictionRequest(values));
    if (result.success) {
      await mutate();
      onClose();
    } else {
      setSubmitError('制限の付与に失敗しました。');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit(onRestrict)}>
        <DialogContent>
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
                  slotProps={{
                    field: { clearable: true },
                    textField: {
                      fullWidth: true,
                      error: Boolean(fieldState.error),
                      helperText: fieldState.error?.message,
                    },
                  }}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            キャンセル
          </Button>
          <Button
            type="submit"
            color="error"
            variant="contained"
            disabled={isSubmitting}
          >
            制限する
          </Button>
        </DialogActions>
      </form>
    </LocalizationProvider>
  );
};

export default RestrictionDialogBody;
