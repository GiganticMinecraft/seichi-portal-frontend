'use client';

import { ArrowBack, ArrowForward } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  Alert,
  AlertTitle,
  Stack,
  Button,
  Typography,
  Link,
  Paper,
  Input,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Grid,
  Chip,
  FormControl,
  InputLabel,
} from '@mui/material';
import NextLink from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { paths } from '@/generated/api-types';
import { errorResponseSchema } from '@/lib/api-types';
import type { GetQuestionsResponse } from '@/lib/api-types';
import type { NonEmptyArray } from '@/generic/Types';
import { proxyClient } from '@/lib/proxyClient';

type Question = {
  id: string;
  title: string;
  description?: string | null | undefined;
  question_type: 'Text' | 'SingleChoice' | 'MultipleChoice';
  choices?: { id?: number | null; label: string; position: number }[];
  is_required: boolean;
};

interface Props {
  questions: GetQuestionsResponse;
  formId: string;
  title: string;
  description: string;
}

interface IFormInput {
  [key: string]: string | NonEmptyArray<string> | boolean;
}

type AnswerCreateBody =
  paths['/forms/{id}/answers']['post']['requestBody']['content']['application/json'];

const AnswerForm = ({ questions, formId, title, description }: Props) => {
  const [isSubmitted, toggleIsSubmitted] = useState(false);
  const [selectedValues, setSelectedValues] = useState<{ [x: string]: string }>(
    {}
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();

  const resetIsSubmitted = () => {
    toggleIsSubmitted(false);
  };

  const onSubmit = async (data: IFormInput) => {
    const formAnswers = Object.entries(data).flatMap(([key, values]) => {
      if (typeof values == 'string') {
        return {
          question_id: key,
          answer: values,
        };
      } else if (typeof values === 'boolean') {
        return [
          {
            question_id: key,
            answer: '',
          },
        ];
      } else {
        return values.map((value) => ({
          question_id: key,
          answer: value,
        }));
      }
    });

    const body: AnswerCreateBody = {
      contents: formAnswers,
    };

    const { response, error } = await proxyClient.POST('/forms/{id}/answers', {
      params: {
        path: {
          id: formId,
        },
      },
      body,
    });

    if (response.ok) {
      toggleIsSubmitted(true);
      reset();
      setSelectedValues({});

      return;
    }

    const safeParsedErrorResponse = errorResponseSchema.safeParse(error);

    if (
      safeParsedErrorResponse.success &&
      safeParsedErrorResponse.data.errorCode == 'OUT_OF_PERIOD'
    ) {
      alert('回答期間が終了しています');
    }
  };

  const generateInputSpace = (question: Question) => {
    const qId = question.id ?? '';
    switch (question.question_type) {
      case 'Text':
        return (
          <Input
            {...register(qId)}
            className="materialUIInput"
            required={question.is_required}
            multiline
            fullWidth
          />
        );
      case 'SingleChoice': {
        const questionId = qId;
        return (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id={`select-label-${questionId}`}>
              選択してください
            </InputLabel>
            <Select
              {...register(questionId)}
              required={question.is_required}
              fullWidth
              labelId={`select-label-${questionId}`}
              label="選択してください"
              value={selectedValues[questionId] ?? ''}
              onChange={(event) => {
                setSelectedValues({
                  ...selectedValues,
                  [questionId]: event.target.value,
                });
              }}
              displayEmpty
            >
              {question.choices?.map((choice, index) => {
                return (
                  <MenuItem key={`q-${qId}.a-${index}`} value={choice.label}>
                    {choice.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        );
      }
      case 'MultipleChoice':
        return (
          <>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {question.choices?.map((choice, index) => (
                <Grid
                  size={{ xs: 12, sm: 6, md: 4 }}
                  key={`q-${qId}.a-${index}`}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...register(qId, {
                          validate: {
                            itemMustBeChecked: (v) => {
                              if (!question.is_required) return true;
                              const errorMessage =
                                'この項目は必須です。少なくとも1つの項目にチェックを入れてください';
                              if (typeof v === 'boolean') return errorMessage;

                              return v.length >= 1 || errorMessage;
                            },
                          },
                        })}
                        value={choice.label}
                      />
                    }
                    label={choice.label}
                  />
                </Grid>
              ))}
            </Grid>
            {errors[qId] && (
              <FormHelperText sx={{ color: 'red' }}>
                {errors[qId]?.message}
              </FormHelperText>
            )}
          </>
        );
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <Stack
        spacing={2}
        sx={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', maxWidth: 600 }}>
          <AlertTitle>Success</AlertTitle>
          回答を送信しました
        </Alert>
        <Stack
          spacing={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            variant="contained"
            onClick={resetIsSubmitted}
            startIcon={<ArrowBack />}
          >
            別の回答をする
          </Button>
          <Link component={NextLink} href="/forms">
            <Button variant="contained" endIcon={<ArrowForward />}>
              フォーム一覧へ
            </Button>
          </Link>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Box
        sx={{ width: '100%', maxWidth: 800, mx: 'auto', alignSelf: 'center' }}
      >
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        {description && (
          <Box sx={{ whiteSpace: 'pre-wrap', mb: 4 }}>
            <Markdown remarkPlugins={[remarkGfm]}>{description}</Markdown>
          </Box>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {questions.map((question) => {
              return (
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
                      <Box
                        sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}
                      >
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {question.description}
                        </Markdown>
                      </Box>
                    )}
                    {generateInputSpace(question as Question)}
                  </Stack>
                </Paper>
              );
            })}
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
  }
};

export default AnswerForm;
