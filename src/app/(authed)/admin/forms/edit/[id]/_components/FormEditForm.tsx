'use client';

import { Add } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
} from '@mui/material';
import { useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { fromStringToJSTDateTime } from '@/generic/DateFormatter';
import FormSettings from './FormSettings';
import QuestionComponent from './Question';
import type { Form } from '../_schema/editFormSchema';
import type {
  GetFormLabelsResponse,
  GetFormResponse,
} from '@/app/api/_schemas/ResponseSchemas';

const FormEditForm = (props: {
  form: GetFormResponse;
  labelOptions: GetFormLabelsResponse;
}) => {
  const start_at = props.form.settings.response_period?.start_at;
  const end_at = props.form.settings.response_period?.end_at;

  const {
    control,
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<Form>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      ...props.form,
      questions: props.form.questions.map((question) => {
        return {
          ...question,
          choices: question.choices.map((choice) => {
            return {
              choice: choice,
            };
          }),
        };
      }),
      settings: {
        ...props.form.settings,
        has_response_period: start_at && end_at ? true : false,
        response_period: {
          start_at: start_at ? fromStringToJSTDateTime(start_at) : null,
          end_at: end_at ? fromStringToJSTDateTime(end_at) : null,
        },
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: control,
    keyName: 'reacthookform-id',
    name: 'questions',
  });

  const visibility = useWatch({
    control: control,
    name: 'settings.visibility',
  });

  const answerVisibility = useWatch({
    control: control,
    name: 'settings.answer_visibility',
  });

  const hasResponsePeriod = useWatch({
    control: control,
    name: 'settings.has_response_period',
    defaultValue: start_at && end_at ? true : false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (data: Form) => {
    const start_at = data.settings.response_period?.start_at;
    const end_at = data.settings.response_period?.end_at;

    const body = {
      title: data.title,
      description: data.description,
      has_response_period: data.settings.has_response_period,
      response_period: {
        start_at: start_at ? `${start_at}:00+09:00` : undefined,
        end_at: end_at ? `${end_at}:00+09:00` : undefined,
      },
      webhook_url: data.settings.webhook_url,
      default_answer_title: data.settings.default_answer_title,
      visibility: data.settings.visibility,
      answer_visibility: data.settings.answer_visibility,
    };

    const setFormMetaResponse = await fetch(`/api/proxy/forms/${data.id}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-cache',
    });

    if (!setFormMetaResponse.ok) {
      setError('root', {
        type: 'manual',
        message: 'フォームのメタデータの更新に失敗しました。',
      });
    }

    const putQuestionsResponse = await fetch(`/api/proxy/forms/questions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        form_id: data.id,
        questions: data.questions.map((question) => {
          return {
            id: props.form.questions.find(
              (beforeQuestion) => beforeQuestion.id == question.id
            )
              ? question.id
              : null,
            title: question.title,
            form_id: data.id,
            description: question.description,
            question_type: question.question_type,
            choices: question.choices.map((choice) => choice.choice),
            is_required: question.is_required,
          };
        }),
      }),
      cache: 'no-cache',
    });

    if (!putQuestionsResponse.ok) {
      setError('root', {
        type: 'manual',
        message: 'フォームの質問の更新に失敗しました。',
      });
    }

    if (setFormMetaResponse.ok && putQuestionsResponse.ok) {
      setIsSubmitted(true);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={10}>
        <Container component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <FormSettings
                  register={register}
                  visibility={visibility}
                  answerVisibility={answerVisibility}
                  has_response_period={hasResponsePeriod}
                  formId={props.form.id}
                  labelOptions={props.labelOptions}
                  currentLabels={props.form.labels}
                />
              </CardContent>
              {fields.map((field, index) => (
                <CardContent key={field['reacthookform-id']}>
                  <QuestionComponent
                    control={control}
                    register={register}
                    removeQuestion={remove}
                    question={{
                      id: field.id,
                      title: field.title,
                      description: field.description,
                      question_type: field.question_type,
                      is_required: field.is_required,
                      choices: field.choices.map((choice) => choice.choice),
                    }}
                    index={index}
                  />
                </CardContent>
              ))}
            </Card>
            {errors.root && (
              <Alert severity="error">{errors.root.message}</Alert>
            )}
            {isSubmitted && (
              <Alert severity="success">フォームの編集に成功しました。</Alert>
            )}
            <Button type="submit" variant="contained" endIcon={<SendIcon />}>
              設定内容を保存
            </Button>
          </Stack>
        </Container>
      </Grid>
      <Grid item xs={2}>
        <Card
          sx={{
            position: 'fixed',
          }}
        >
          <CardContent>
            <Button
              type="button"
              aria-label="質問の追加"
              onClick={() => {
                append({
                  id: null,
                  title: '',
                  description: '',
                  question_type: 'TEXT',
                  choices: [],
                  is_required: false,
                });
              }}
              endIcon={<Add />}
            >
              質問の追加
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default FormEditForm;
