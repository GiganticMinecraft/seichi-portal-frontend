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
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import type { GetFormLabelsResponse } from '@/lib/api-types';
import FormEditorLayout from '../../_components/FormEditorLayout';
import FormSettings from '../../_components/FormSettings';
import QuestionEditor from '../../_components/QuestionEditor';
import QuestionList from '../../_components/QuestionList';
import type { FormEditorValues } from '../../_schema/formEditorSchema';
import { formEditorSchema } from '../../_schema/formEditorSchema';
import {
  createEmptyFormEditorQuestion,
  createEmptyFormEditorValues,
} from '../../_lib/formEditorDefaults';
import { useCreateForm } from '../_hooks/useCreateForm';

const FormCreateForm = (props: { labelOptions: GetFormLabelsResponse }) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormEditorValues>({
    mode: 'onSubmit',
    resolver: zodResolver(formEditorSchema),
    defaultValues: createEmptyFormEditorValues(),
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'questions',
  });

  const hasAcceptancePeriod = useWatch({
    control,
    name: 'settings.has_acceptance_period',
    defaultValue: false,
  });

  const { createForm, isSubmitted, submitError } = useCreateForm();
  const questionListError =
    typeof errors.questions?.message === 'string'
      ? errors.questions.message
      : null;

  const addQuestion = () => {
    append(createEmptyFormEditorQuestion());
  };

  const formContent = (
    <Container component="form" onSubmit={handleSubmit(createForm)}>
      <Stack spacing={2}>
        <Card>
          <CardContent>
            <FormSettings
              control={control}
              register={register}
              hasAcceptancePeriod={hasAcceptancePeriod}
              labelOptions={props.labelOptions}
            />
          </CardContent>
          <QuestionList
            items={fields.map((field, index) => ({
              dndId: field.id,
              content: (
                <QuestionEditor
                  control={control}
                  register={register}
                  removeQuestion={remove}
                  questionIndex={index}
                />
              ),
            }))}
            onMove={move}
          />
        </Card>
        {(errors.root || submitError) && (
          <Alert severity="error">
            {errors.root?.message ?? submitError?.message}
          </Alert>
        )}
        {questionListError && (
          <Alert severity="error">{questionListError}</Alert>
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
    <FormEditorLayout onAddQuestion={addQuestion}>
      {formContent}
    </FormEditorLayout>
  );
};

export default FormCreateForm;
