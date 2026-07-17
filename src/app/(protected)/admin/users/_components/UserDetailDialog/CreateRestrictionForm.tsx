import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Stack, TextField, Tooltip } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Controller, useForm } from 'react-hook-form';

import { restrictionFormSchema } from './restrictionForm';
import type {
  RestrictionFormExpiration,
  RestrictionFormInput,
  RestrictionFormValues,
} from './restrictionForm';

const CreateRestrictionForm = ({
  disabled,
  submitError,
  onSubmit,
}: {
  disabled: boolean;
  submitError: string | null;
  onSubmit: (values: RestrictionFormValues) => Promise<void>;
}) => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RestrictionFormInput, unknown, RestrictionFormValues>({
    resolver: zodResolver(restrictionFormSchema),
    defaultValues: { reason: '', expiration: { kind: 'indefinite' } },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
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
                helperText={
                  fieldState.error?.message ?? 'Markdown に対応しています。'
                }
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

export default CreateRestrictionForm;
