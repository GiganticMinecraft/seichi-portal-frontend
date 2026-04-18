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
import type { paths } from '@/generated/api-types';
import { proxyClient } from '@/lib/proxyClient';
import FormSettings from './FormSettings';
import QuestionComponent from './Question';
import type { Form } from '../_schema/createFormSchema';
import type { GetFormLabelsResponse } from '@/lib/api-types';

type CreateFormBody =
  paths['/forms']['post']['requestBody']['content']['application/json'];
type FormUpdateBody =
  paths['/forms/{id}']['patch']['requestBody']['content']['application/json'];
type QuestionsUpdateBody =
  paths['/forms/{id}/questions']['put']['requestBody']['content']['application/json'];
type FormLabelsUpdateBody =
  paths['/forms/{form_id}/labels']['put']['requestBody']['content']['application/json'];

const FormCreateForm = (props: { labelOptions: GetFormLabelsResponse }) => {
  const {
    control,
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<Form>({
    mode: 'onSubmit',
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

  const [labels, setLabels] = useState<GetFormLabelsResponse>([]);

  const onSubmit = async (data: Form) => {
    let createdFormId: string;
    try {
      const createFormBody: CreateFormBody = {
        title: data.title,
        description: data.description,
      };
      const { data: createdForm, response } = await proxyClient.POST('/forms', {
        body: createFormBody,
      });
      if (!response.ok || !createdForm) {
        throw new Error('failed to create form');
      }
      createdFormId = createdForm.id;
    } catch {
      setError('root', {
        type: 'manual',
        message: 'フォームの作成に失敗しました。',
      });
      return;
    }

    const start_at = data.settings.response_period.start_at;
    const end_at = data.settings.response_period.end_at;

    const body: FormUpdateBody = {
      title: data.title,
      description: data.description,
      settings: {
        visibility: data.settings.visibility,
        webhook_url: data.settings.webhook_url,
        answer_settings: {
          default_answer_title:
            data.settings.default_answer_title === ''
              ? null
              : data.settings.default_answer_title,
          response_period: data.settings.has_response_period
            ? {
                start_at: start_at ? `${start_at}:00+09:00` : null,
                end_at: end_at ? `${end_at}:00+09:00` : null,
              }
            : null,
          visibility: data.settings.answer_visibility,
        },
      },
    };

    const { response: setFormMetadataResponse } = await proxyClient.PATCH(
      '/forms/{id}',
      {
        params: {
          path: {
            id: createdFormId,
          },
        },
        body,
      }
    );

    if (!setFormMetadataResponse.ok) {
      setError('root', {
        type: 'manual',
        message: 'フォームのメタデータの設定に失敗しました。',
      });

      return;
    }

    const questionsBody: QuestionsUpdateBody = {
      questions: data.questions.map((question) => ({
        ...question,
        choices: question.choices.map((choice) => choice.choice),
      })),
    };
    const { response: addQuestionResponse } = await proxyClient.PUT(
      '/forms/{id}/questions',
      {
        params: {
          path: {
            id: createdFormId,
          },
        },
        body: questionsBody,
      }
    );

    if (addQuestionResponse.ok) {
      const labelsBody: FormLabelsUpdateBody = {
        labels: labels.map((label) => label.id),
      };
      const { response: putLabelsResponse } = await proxyClient.PUT(
        '/forms/{form_id}/labels',
        {
          params: {
            path: {
              form_id: createdFormId,
            },
          },
          body: labelsBody,
        }
      );
      if (putLabelsResponse.ok) {
        setIsSubmitted(true);
      } else {
        setError('root', {
          type: 'manual',
          message: 'ラベルの設定に失敗しました。',
        });
      }
    } else {
      setError('root', {
        type: 'manual',
        message: '質問の追加に失敗しました。',
      });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={10}>
        <Container component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <FormSettings
                  register={register}
                  visibility={visibility}
                  has_response_period={has_response_period}
                  labelOptions={props.labelOptions}
                  setLabels={setLabels}
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
      <Grid size={2}>
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
