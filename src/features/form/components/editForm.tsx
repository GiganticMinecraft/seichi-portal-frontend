'use client';

import { Option, none, some } from 'fp-ts/lib/Option';
import { UseFormRegister, useForm } from 'react-hook-form';
import { Box, FormGroup, Select } from '@material-ui/core';
import { Stack, TextField } from '@mui/material';
import { Form } from '../types/formSchema';

interface IForm {
  form_id: Option<number>;
  form_title: Option<string>;
  form_description: Option<string>;
  response_period: {
    start_at: Option<string>;
    end_at: Option<string>;
  };
  webhook_url: Option<string>;
  visibility: Option<'PUBLIC' | 'PRIVATE'>;
  questions: {
    question_id: number;
    question: string;
    question_type: 'TEXT' | 'SINGLE' | 'MULTIPLE';
    choices: string[];
  }[];
}

const FormMetaComponent = ({
  register,
}: {
  register: UseFormRegister<IForm>;
}) => {
  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'white' }}>
      <Stack spacing={2}>
        <TextField
          {...register('form_title')}
          label="フォームのタイトル"
          variant="outlined"
        />
        <TextField
          {...register('form_description')}
          label="フォームの説明"
          variant="outlined"
        />
        <TextField
          {...register('response_period.start_at')}
          label="回答開始日"
          type="datetime-local"
          variant="outlined"
        />
        <TextField
          {...register('response_period.end_at')}
          label="回答終了日"
          type="datetime-local"
          variant="outlined"
        />
        <TextField
          {...register('webhook_url')}
          label="Webhook URL"
          variant="outlined"
        />
        <Select
          {...register('visibility')}
          labelId="Visibility"
          id="Visibility"
          label="公開設定"
        >
          <option value="PUBLIC">公開</option>
          <option value="PRIVATE">非公開</option>
        </Select>
      </Stack>
    </Box>
  );
};

export const EditFormComponent = async ({ form }: { form: Form }) => {
  const { register, handleSubmit, control } = useForm<IForm>({
    defaultValues: {
      form_id: some(form.id),
      form_title: none,
      form_description: none,
      response_period: {
        start_at: none,
        end_at: none,
      },
      webhook_url: none,
      visibility: some(form.settings.visibility),
      questions: form.questions,
    },
  });

  return (
    <form>
      <FormGroup>
        <FormMetaComponent register={register} />
      </FormGroup>
    </form>
  );
};
