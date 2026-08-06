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
import { match, P } from 'ts-pattern';

import type { AnswerFormInput, AnswerQuestion } from './answerFormTypes';

type Props = {
  question: AnswerQuestion;
  control: Control<AnswerFormInput>;
  register: UseFormRegister<AnswerFormInput>;
  errors: FieldErrors<AnswerFormInput>;
  disabled?: boolean;
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
  disabled = false,
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
            disabled={disabled}
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
                  disabled={disabled}
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
          <Controller
            control={control}
            name={questionId}
            defaultValue={question.choices.length === 1 ? false : []}
            rules={{
              validate: {
                itemMustBeChecked: (value) => {
                  if (!question.is_required) return true;

                  return (
                    (Array.isArray(value) && value.length >= 1) ||
                    (typeof value === 'string' && value !== '') ||
                    requiredMultiSelectMessage
                  );
                },
              },
            }}
            render={({ field }) => {
              const selectedValues: string[] = match(field.value)
                .with('', () => [])
                .with(P.string, (value) => [value])
                .with(P.array(P.string), (value) => value)
                .otherwise(() => []);
              const choiceOrder = new Map(
                question.choices.map((item, itemIndex) => [
                  item.label,
                  itemIndex,
                ])
              );

              return (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {question.choices.map((choice, index) => (
                    <Grid
                      size={{ xs: 12, sm: 6, md: 4 }}
                      key={`q-${questionId}.a-${index}`}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedValues.includes(choice.label)}
                            onChange={(_, checked) => {
                              if (question.choices.length === 1) {
                                field.onChange(checked ? choice.label : false);
                                return;
                              }

                              const nextValues = match({
                                checked,
                                alreadySelected: selectedValues.includes(
                                  choice.label
                                ),
                              })
                                .with(
                                  { checked: true, alreadySelected: true },
                                  () => selectedValues
                                )
                                .with({ checked: true }, () => [
                                  ...selectedValues,
                                  choice.label,
                                ])
                                .otherwise(() =>
                                  selectedValues.filter(
                                    (value) => value !== choice.label
                                  )
                                );
                              const orderedValues = [...nextValues].sort(
                                (left, right) =>
                                  (choiceOrder.get(left) ?? -1) -
                                  (choiceOrder.get(right) ?? -1)
                              );

                              field.onChange(orderedValues);
                            }}
                            onBlur={field.onBlur}
                            ref={index === 0 ? field.ref : undefined}
                            disabled={disabled}
                          />
                        }
                        label={choice.label}
                      />
                    </Grid>
                  ))}
                </Grid>
              );
            }}
          />
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
