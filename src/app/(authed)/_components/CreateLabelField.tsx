'use client';

import { AddCircle } from '@mui/icons-material';
import { Button, Container, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useLabelCRUD } from '@/hooks/useLabelCRUD';

type CreateLabelSchema = {
  name: string;
};

const CreateLabelField = (props: { labelType: 'answers' | 'forms' }) => {
  const { handleSubmit, register, reset } = useForm<CreateLabelSchema>();
  const { createLabel } = useLabelCRUD(props.labelType);

  const onSubmit = async (data: CreateLabelSchema) => {
    await createLabel(data.name);
    reset();
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
