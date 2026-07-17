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
import { useFieldArray, useForm } from 'react-hook-form';

import type {
  GetFormLabelsResponse,
  GetFormResponse,
  GetUserGroupsResponse,
} from '@/lib/api-types';

import FormEditorLayout from '../../../_components/FormEditor/FormEditorLayout';
import FormSettings from '../../../_components/FormEditor/FormSettings';
import QuestionEditor from '../../../_components/FormEditor/QuestionEditor';
import QuestionList from '../../../_components/FormEditor/QuestionList';
import { useUpdateFormSubmission } from '../../../_hooks/useUpdateFormSubmission';
import { createEmptyFormEditorQuestion } from '../../../_lib/formEditorDefaults';
import { fromFormResponseToEditorValues } from '../../../_lib/formRequestBuilders';
import type { FormEditorValues } from '../../../_schema/formEditorSchema';
import { formEditorSchema } from '../../../_schema/formEditorSchema';

const FormEditForm = (props: {
  form: GetFormResponse;
  labelOptions: GetFormLabelsResponse;
  groupOptions: GetUserGroupsResponse;
}) => {
  const {
    control,
    handleSubmit,
    register,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormEditorValues>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    resolver: zodResolver(formEditorSchema),
    defaultValues: fromFormResponseToEditorValues(props.form),
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    keyName: 'reacthookform-id',
    name: 'questions',
  });

  const { submit, isSubmitted } = useUpdateFormSubmission(props.form.id);
  const questionListError =
    typeof errors.questions?.message === 'string'
      ? errors.questions.message
      : undefined;

  const onSubmit = async (data: FormEditorValues) => {
    const result = await submit(data);
    if (!result.ok) {
      setError('root', {
        type: 'manual',
        message: result.errorMessage,
      });
    }
  };

  return (
    <FormEditorLayout
      onAddQuestion={() => {
        append(createEmptyFormEditorQuestion());
      }}
    >
      <Container
        component="form"
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
      >
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <FormSettings
                register={register}
                control={control}
                setValue={setValue}
                labelOptions={props.labelOptions}
                groupOptions={props.groupOptions}
              />
            </CardContent>
            <QuestionList
              items={fields.map((field, index) => ({
                dndId: field['reacthookform-id'],
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
          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
          {questionListError && (
            <Alert severity="error">{questionListError}</Alert>
          )}
          {isSubmitted && (
            <Alert severity="success">フォームの編集に成功しました。</Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            disabled={isSubmitting}
          >
            設定内容を保存
          </Button>
        </Stack>
      </Container>
    </FormEditorLayout>
  );
};

export default FormEditForm;
