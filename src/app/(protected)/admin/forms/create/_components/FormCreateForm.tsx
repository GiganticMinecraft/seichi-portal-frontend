'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import type {
  GetFormLabelsResponse,
  GetUserGroupsResponse,
} from '@/lib/api-types';

import FormEditorLayout from '../../_components/FormEditor/FormEditorLayout';
import FormSettings from '../../_components/FormEditor/FormSettings';
import QuestionEditor from '../../_components/FormEditor/QuestionEditor';
import QuestionList from '../../_components/FormEditor/QuestionList';
import {
  createEmptyFormEditorQuestion,
  createEmptyFormEditorValues,
} from '../../_lib/formEditorDefaults';
import type { FormEditorValues } from '../../_schema/formEditorSchema';
import { formEditorSchema } from '../../_schema/formEditorSchema';
import { useCreateForm } from '../_hooks/useCreateForm';

const FormCreateForm = (props: {
  labelOptions: GetFormLabelsResponse;
  groupOptions: GetUserGroupsResponse;
}) => {
  const {
    control,
    handleSubmit,
    register,
    setValue,
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

  const router = useRouter();
  const { createForm, submitState } = useCreateForm();

  useEffect(() => {
    if (submitState.kind === 'submitted') {
      router.push(
        `/admin/forms?createdFormId=${encodeURIComponent(submitState.formId)}`
      );
    }
  }, [submitState, router]);

  const questionListError =
    typeof errors.questions?.message === 'string'
      ? errors.questions.message
      : undefined;
  const submitErrorMessage =
    submitState.kind === 'failed' ? submitState.message : undefined;

  const addQuestion = () => {
    append(createEmptyFormEditorQuestion());
  };

  const formContent = (
    <Container
      component="form"
      onSubmit={(e) => {
        void handleSubmit(createForm)(e);
      }}
    >
      <Stack spacing={2}>
        <Card>
          <CardContent>
            <FormSettings
              control={control}
              register={register}
              setValue={setValue}
              labelOptions={props.labelOptions}
              groupOptions={props.groupOptions}
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
        {(errors.root || submitErrorMessage) && (
          <Alert severity="error">
            {errors.root?.message ?? submitErrorMessage}
          </Alert>
        )}
        {questionListError && (
          <Alert severity="error">{questionListError}</Alert>
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
