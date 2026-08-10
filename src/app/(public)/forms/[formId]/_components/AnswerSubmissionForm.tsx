'use client';

import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { RefCallback } from 'react';
import { useForm } from 'react-hook-form';

import FieldLabel from '@/app/_components/FieldLabel';
import MarkdownText from '@/app/_components/MarkdownText';
import RequiredChip from '@/app/_components/RequiredChip';
import { TurnstileWidget } from '@/app/_components/TurnstileWidget';
import type { GetQuestionsResponse } from '@/lib/api-types';

import { resolveChoiceLabels, TEMPORARY_USER_FIELDS } from './answerFormTypes';
import type { AnswerFormInput } from './answerFormTypes';
import QuestionFieldRenderer from './QuestionFieldRenderer';

type Props = {
  questions: GetQuestionsResponse;
  title: string;
  description: string;
  isTemporary: boolean;
  onSubmitAnswers: (data: AnswerFormInput) => Promise<{ ok: boolean }>;
  disabled?: boolean;
  turnstileContainerRef?: RefCallback<HTMLDivElement>;
};

/**
 * 回答入力中の UI を担う component。
 * 質問描画と form state 管理を持ち、送信処理そのものは外から注入する。
 */
const AnswerSubmissionForm = ({
  questions,
  title,
  description,
  isTemporary,
  onSubmitAnswers,
  disabled = false,
  turnstileContainerRef,
}: Props) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AnswerFormInput>();

  const handleAnswerSubmit = async (data: AnswerFormInput) => {
    const result = await onSubmitAnswers(resolveChoiceLabels(data, questions));
    if (!result.ok) {
      return;
    }

    reset();
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', alignSelf: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      {description && <MarkdownText sx={{ mb: 4 }}>{description}</MarkdownText>}
      <form
        onSubmit={(e) => {
          void handleSubmit(handleAnswerSubmit)(e);
        }}
      >
        <Stack spacing={3}>
          {isTemporary && (
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6" component="span">
                  回答者情報
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  サインインせずに回答するため、お名前と連絡先の入力が必要です。
                </Typography>
                <Stack spacing={0.5}>
                  <FieldLabel label="お名前" required />
                  <TextField
                    {...register(TEMPORARY_USER_FIELDS.name, {
                      required: '入力してください。',
                    })}
                    slotProps={{ htmlInput: { 'aria-label': 'お名前' } }}
                    disabled={disabled}
                    error={Boolean(errors[TEMPORARY_USER_FIELDS.name])}
                    helperText={errors[TEMPORARY_USER_FIELDS.name]?.message}
                  />
                </Stack>
                <Stack spacing={0.5}>
                  <FieldLabel label="連絡先" required />
                  <TextField
                    {...register(TEMPORARY_USER_FIELDS.contactText, {
                      required: '入力してください。',
                    })}
                    slotProps={{ htmlInput: { 'aria-label': '連絡先' } }}
                    disabled={disabled}
                    helperText={
                      errors[TEMPORARY_USER_FIELDS.contactText]?.message ??
                      'Discord ユーザー名やメールアドレスなど、連絡が取れる情報を入力してください。'
                    }
                    error={Boolean(errors[TEMPORARY_USER_FIELDS.contactText])}
                  />
                </Stack>
              </Stack>
            </Paper>
          )}
          {questions.map((question) => (
            <Paper key={question.id} variant="outlined" sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" component="span">
                    {question.title}
                  </Typography>
                  {question.is_required && (
                    <RequiredChip sx={{ ml: 1, verticalAlign: 'middle' }} />
                  )}
                </Box>
                {question.description && (
                  <MarkdownText>{question.description}</MarkdownText>
                )}
                <QuestionFieldRenderer
                  question={question}
                  control={control}
                  register={register}
                  errors={errors}
                  disabled={disabled}
                />
              </Stack>
            </Paper>
          ))}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 2,
              mt: 2,
            }}
          >
            {isTemporary && turnstileContainerRef && (
              <TurnstileWidget containerRef={turnstileContainerRef} />
            )}
            <Button
              type="submit"
              variant="contained"
              size="large"
              endIcon={<SendIcon />}
              disabled={isSubmitting || disabled}
            >
              送信
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default AnswerSubmissionForm;
