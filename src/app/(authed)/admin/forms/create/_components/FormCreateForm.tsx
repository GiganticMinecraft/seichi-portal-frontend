'use client';

import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
} from '@mui/material';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import type { GetFormLabelsResponse } from '@/lib/api-types';
import { useCreateForm } from '../_hooks/useCreateForm';
import type { Form } from '../_schema/createFormSchema';
import FormCreateLayout from './FormCreateLayout';
import FormSettings from './FormSettings';
import QuestionComponent from './Question';

const FormCreateForm = (props: { labelOptions: GetFormLabelsResponse }) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    mode: 'onSubmit',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const visibility = useWatch({
    control,
    name: 'settings.visibility',
    defaultValue: 'PUBLIC',
  });

  const has_response_period = useWatch({
    control,
    name: 'settings.has_response_period',
    defaultValue: false,
  });

  const { createForm, isSubmitted, submitError } = useCreateForm();

  const addQuestion = () => {
    append({
      title: '',
      description: '',
      question_type: 'TEXT',
      choices: [],
      is_required: false,
    });
  };

  const formContent = (
    <Container component="form" onSubmit={handleSubmit(createForm)}>
      <Stack spacing={2}>
        <Card>
          <CardContent>
            <FormSettings
              control={control}
              register={register}
              visibility={visibility}
              has_response_period={has_response_period}
              labelOptions={props.labelOptions}
            />
          </CardContent>
          {fields.map((field, index) => (
            <CardContent key={field.id}>
              <QuestionComponent
                control={control}
                register={register}
                removeQuestion={remove}
                questionId={index}
              />
            </CardContent>
          ))}
        </Card>
        {(errors.root || submitError) && (
          <Alert severity="error">
            {errors.root?.message ?? submitError?.message}
          </Alert>
        )}
        {isSubmitted && (
          <Alert severity="success">フォームを作成しました。</Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          disabled={isSubmitting}
        >
          フォーム作成
        </Button>
      </Stack>
    </Container>
  );

  return (
    <FormCreateLayout formContent={formContent} onAddQuestion={addQuestion} />
  );
};

export default FormCreateForm;
