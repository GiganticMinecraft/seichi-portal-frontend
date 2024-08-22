import { Button, Container, Stack, TextField } from '@mui/material';
import { CreateLabelSchema } from '../_schemas/createLabelSchema';
import { useForm } from 'react-hook-form';
import { AddCircle } from '@mui/icons-material';

const CreateLabelField = () => {
  const { handleSubmit, register } = useForm<CreateLabelSchema>();

  const onSubmit = async (data: CreateLabelSchema) => {
    await fetch('/api/answers/labels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };

  return (
    <Container component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        spacing={2}
      >
        <TextField
          sx={{ width: '90%', height: '100%' }}
          {...register('name')}
          label="ラベル名"
          required
        />
        <Button variant="contained" startIcon={<AddCircle />} type="submit">
          作成
        </Button>
      </Stack>
    </Container>
  );
};

export default CreateLabelField;
