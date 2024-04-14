import { zodResolver } from '@hookform/resolvers/zod';
import { Container, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { formSchema } from '@/_schemas/formSchema';
import type { Form} from '@/_schemas/formSchema';

export const CreateFormComponent = () => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Form>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: Form) => {
    // todo: データの送信処理を書く
  };

  return (
    <Container component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <Typography variant="body1">フォームタイトル</Typography>
        <TextField {...register('title')} required />
        <TextField
          {...register('description')}
          label="フォーム説明"
          variant="outlined"
        />
      </Stack>
    </Container>
  );
};
