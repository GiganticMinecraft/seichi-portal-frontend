'use client';

import { Add } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { useCallback } from 'react';
import { useController, useFieldArray, useWatch } from 'react-hook-form';
import type { Form } from '../_schema/editFormSchema';
import type { Control, UseFormRegister } from 'react-hook-form';

interface Question {
  id: number;
  title: string;
  description: string;
  question_type: 'TEXT' | 'SINGLE' | 'MULTIPLE';
  choices: string[];
  is_required: boolean;
}

const QuestionComponent = ({
  control,
  register,
  removeQuestion,
  question,
}: {
  control: Control<Form>;
  register: UseFormRegister<Form>;
  removeQuestion: (index: number) => void;
  question: Question;
}) => {
  const {
    fields: choicesField,
    append: appendChoices,
    remove: removeChoices,
  } = useFieldArray({
    control: control,
    name: `questions.${question.id}.choices`,
  });

  const { field } = useController({
    control,
    name: `questions.${question.id}.question_type`,
  });

  const useWatchQuestionType = useWatch({
    control,
    name: `questions.${question.id}.question_type`,
  });

  const addChoice = useCallback(() => {
    if (useWatchQuestionType !== 'TEXT') {
      appendChoices({ choice: '' });
    }
  }, [useWatchQuestionType, appendChoices]);

  const removeChoice = (index: number) => {
    if (choicesField.length > 1) {
      removeChoices(index);
    }
  };

  return (
    <Stack spacing={2}>
      <TextField {...register(`questions.${question.id}.id`)} type="hidden" />
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        質問{question.id + 1} (question_id: {question.id})
      </Typography>
      <Button
        variant="outlined"
        startIcon={<DeleteIcon />}
        onClick={() => removeQuestion(question.id)}
      >
        質問の削除
      </Button>
      <TextField
        {...register(`questions.${question.id}.title`)}
        label="質問タイトル"
        defaultValue={question.title}
        required
      />
      <TextField
        {...register(`questions.${question.id}.description`)}
        label="質問の説明"
        defaultValue={question.description}
      />
      <TextField
        {...register(`questions.${question.id}.question_type`)}
        label="質問の種類"
        select
        required
        defaultValue={question.question_type}
        helperText="質問の種類を選択してください。"
        onChange={(event) => {
          // NOTE: 単純に onChange 書くと useWatchQuestionType が動作しないので field.onChange を呼び出す必要がある
          // ref: https://github.com/orgs/react-hook-form/discussions/9144
          field.onChange(event);

          if (event.target.value === 'TEXT') {
            removeChoices();
          } else if (choicesField.length === 0) {
            // NOTE: choicesField.lengthが0であることを確認しないと
            // 単一選択 -> 複数選択 -> 単一選択のように変更した場合に選択肢の入力欄が増加してしまう
            appendChoices({ choice: '' });
          }
        }}
      >
        <MenuItem onSelect={() => removeChoices()} value="TEXT">
          テキスト
        </MenuItem>
        <MenuItem value="SINGLE">単一選択</MenuItem>
        <MenuItem value="MULTIPLE">複数選択</MenuItem>
      </TextField>
      <FormControlLabel
        label="この質問への回答を必須にする"
        control={
          <Checkbox {...register(`questions.${question.id}.is_required`)} />
        }
      />
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={() => addChoice()}
        disabled={useWatchQuestionType == 'TEXT'}
      >
        選択肢の追加
      </Button>
      {choicesField.map((field, index) => {
        return (
          <Stack direction="row" key={field.id}>
            <TextField
              {...register(`questions.${question.id}.choices.${index}.choice`)}
              key={field.id}
              label={`選択肢${index + 1}`}
              defaultValue={field.choice}
              required
            />
            <IconButton size="small" onClick={() => removeChoice(index)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default QuestionComponent;
