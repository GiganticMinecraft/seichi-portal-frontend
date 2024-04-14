import { Stack, TextField, Typography } from '@mui/material';
import { useController } from 'react-hook-form';
import type { RHFProps } from './RHFProps';
import type { FieldValues} from 'react-hook-form';

export const RHFTextField = <T extends FieldValues>({
  name,
  control,
  label,
}: RHFProps<T>) => {
  const {
    field,
    formState: { errors },
  } = useController({ name, control });

  const errorMessage = errors?.[name]?.message as string;

  return (
    <Stack direction="row" alignItems="center" m={2}>
      <Typography>{label}</Typography>
      <TextField
        value={field.value ?? ''}
        inputRef={field.ref}
        name={field.name}
        onChange={field.onChange}
        onBlur={field.onBlur}
      />
      {errorMessage && (
        <Typography ml={3} color="red">
          {errorMessage}
        </Typography>
      )}
    </Stack>
  );
};
