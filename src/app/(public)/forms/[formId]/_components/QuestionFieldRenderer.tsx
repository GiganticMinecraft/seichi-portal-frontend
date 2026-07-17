'use client';

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';

import type { AnswerFormInput, AnswerQuestion } from './answerFormTypes';

type Props = {
  question: AnswerQuestion;
  control: Control<AnswerFormInput>;
  register: UseFormRegister<AnswerFormInput>;
  errors: FieldErrors<AnswerFormInput>;
};

const requiredMultiSelectMessage =
  'この項目は必須です。少なくとも1つの項目にチェックを入れてください';

/**
 * 質問タイプごとの入力 UI 差分を閉じ込める renderer。
 * 新しい質問タイプを足す場合はまずここを拡張する。
 */
const QuestionFieldRenderer = ({
  question,
  control,
  register,
  errors,
}: Props) => {
  const questionId = question.id;

  switch (question.question_type) {
    case 'Text':
      return (
        <FormControl fullWidth>
          <Input
            {...register(questionId)}
            className="materialUIInput"
            required={question.is_required}
            multiline
            fullWidth
          />
          <FormHelperText>Markdown に対応しています。</FormHelperText>
        </FormControl>
      );
    case 'SingleChoice':
      return (
        <FormControl
          fullWidth
          sx={{ mt: 2 }}
          error={Boolean(errors[questionId])}
        >
          <InputLabel id={`select-label-${questionId}`} shrink>
            選択してください
          </InputLabel>
          <Controller
            control={control}
            name={questionId}
            rules={{
              required: question.is_required ? '選択してください。' : false,
            }}
            render={({ field }) => {
              const fieldValue =
                typeof field.value === 'string' ? field.value : '';

              return (
                <Select
                  {...field}
                  fullWidth
                  labelId={`select-label-${questionId}`}
                  label="選択してください"
                  value={fieldValue}
                  inputProps={{ 'aria-required': question.is_required }}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    if (typeof nextValue !== 'string') {
                      return;
                    }

                    field.onChange(nextValue);
                  }}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>未選択</em>
                  </MenuItem>
                  {question.choices.map((choice, index) => (
                    <MenuItem
                      key={`q-${questionId}.a-${index}`}
                      value={choice.label}
                    >
                      {choice.label}
                    </MenuItem>
                  ))}
                </Select>
              );
            }}
          />
          {errors[questionId] && (
            <FormHelperText>{errors[questionId].message}</FormHelperText>
          )}
        </FormControl>
      );
    case 'MultipleChoice':
      return (
        <>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {question.choices.map((choice, index) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 4 }}
                key={`q-${questionId}.a-${index}`}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      {...register(questionId, {
                        validate: {
                          itemMustBeChecked: (value) => {
                            if (!question.is_required) return true;
                            if (typeof value === 'boolean') {
                              return requiredMultiSelectMessage;
                            }

                            return (
                              value.length >= 1 || requiredMultiSelectMessage
                            );
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
          {errors[questionId] && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {errors[questionId].message}
            </FormHelperText>
          )}
        </>
      );
    default:
      return null;
  }
};

export default QuestionFieldRenderer;
