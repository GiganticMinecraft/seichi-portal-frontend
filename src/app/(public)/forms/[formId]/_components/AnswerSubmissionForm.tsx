'use client';

import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import type { GetQuestionsResponse } from '@/lib/api-types';

import { TEMPORARY_USER_FIELDS } from './answerFormTypes';
import type { AnswerFormInput } from './answerFormTypes';
import QuestionFieldRenderer from './QuestionFieldRenderer';

type Props = {
  questions: GetQuestionsResponse;
  title: string;
  description: string;
  isTemporary: boolean;
  onSubmitAnswers: (data: AnswerFormInput) => Promise<{ ok: boolean }>;
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
}: Props) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnswerFormInput>();

  const handleAnswerSubmit = async (data: AnswerFormInput) => {
    const result = await onSubmitAnswers(data);
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
      {description && (
        <Box sx={{ whiteSpace: 'pre-wrap', mb: 4 }}>
          <Markdown remarkPlugins={[remarkGfm]}>{description}</Markdown>
        </Box>
      )}
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
                <TextField
                  {...register(TEMPORARY_USER_FIELDS.name, {
                    required: '入力してください。',
                  })}
                  label="お名前"
                  required
                  error={Boolean(errors[TEMPORARY_USER_FIELDS.name])}
                  helperText={errors[TEMPORARY_USER_FIELDS.name]?.message}
                />
                <TextField
                  {...register(TEMPORARY_USER_FIELDS.contactText, {
                    required: '入力してください。',
                  })}
                  label="連絡先"
                  required
                  helperText={
                    errors[TEMPORARY_USER_FIELDS.contactText]?.message ??
                    'Discord ユーザー名やメールアドレスなど、連絡が取れる情報を入力してください。'
                  }
                  error={Boolean(errors[TEMPORARY_USER_FIELDS.contactText])}
                />
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
                    <Chip
                      size="small"
                      color="error"
                      label="必須"
                      sx={{ ml: 1, verticalAlign: 'middle' }}
                    />
                  )}
                </Box>
                {question.description && (
                  <Box sx={{ whiteSpace: 'pre-wrap' }}>
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {question.description}
                    </Markdown>
                  </Box>
                )}
                <QuestionFieldRenderer
                  question={question}
                  control={control}
                  register={register}
                  errors={errors}
                />
              </Stack>
            </Paper>
          ))}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 2,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              size="large"
              endIcon={<SendIcon />}
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
