'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
import { createFormResponseSchema } from '@/app/api/_schemas/ResponseSchemas';
import FormSettings from './FormSettings';
import QuestionComponent from './Question';
import { formSchema } from '../_schema/createFormSchema';
import type { Form } from '../_schema/createFormSchema';

const FormCreateForm = () => {
  const {
    control,
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<Form>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    resolver: zodResolver(formSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const visibility = useWatch({
    control: control,
    name: 'settings.visibility',
    defaultValue: 'PUBLIC',
  });

  const has_response_period = useWatch({
    control: control,
    name: 'settings.has_response_period',
    defaultValue: false,
  });

  const addQuestionButton = () => {
    append({
      title: '',
      description: '',
      question_type: 'TEXT',
      choices: [],
      is_required: false,
    });
  };

  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (data: Form) => {
    console.log('onsubmit');

    const createFormResponse = await fetch('/api/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
      }),
      cache: 'no-cache',
    });

    const parsedCreateFormResponse = createFormResponseSchema.safeParse(
      await createFormResponse.json()
    );

    if (!parsedCreateFormResponse.success) {
      setError('root', {
        type: 'manual',
        message: 'フォームの作成に失敗しました。',
      });

      return;
    }

    const start_at = data.settings.response_period.start_at;
    const end_at = data.settings.response_period.end_at;

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
    };

    const setFormMetadataResponse = await fetch(
      `/api/form?form_id=${parsedCreateFormResponse.data.id}`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-cache',
      }
    );

    if (!setFormMetadataResponse.ok) {
      setError('root', {
        type: 'manual',
        message: 'フォームのメタデータの設定に失敗しました。',
      });

      return;
    }

    const addQuestionResponse = await fetch('/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        form_id: parsedCreateFormResponse.data.id,
        questions: data.questions.map((question) => ({
          ...question,
          choices: question.choices.map((choice) => choice.choice),
        })),
      }),
      cache: 'no-cache',
    });

    if (addQuestionResponse.ok) {
      setIsSubmitted(true);
    } else {
      setError('root', {
        type: 'manual',
        message: '質問の追加に失敗しました。',
      });
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
                  has_response_period={has_response_period}
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
            {errors.root && (
              <Alert severity="error">{errors.root.message}</Alert>
            )}
            {isSubmitted && (
              <Alert severity="success">フォームを作成しました。</Alert>
            )}
            <Button type="submit" variant="contained" endIcon={<SendIcon />}>
              フォーム作成
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
              onClick={() => addQuestionButton()}
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

export default FormCreateForm;
