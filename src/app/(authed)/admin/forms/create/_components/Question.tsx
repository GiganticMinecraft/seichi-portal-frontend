import { Add } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import type { Form } from '../_schema/createFormSchema';
import type { Control, UseFormRegister } from 'react-hook-form';

const QuestionComponent = ({
  control,
  register,
  removeQuestion,
  questionId,
}: {
  control: Control<Form>;
  register: UseFormRegister<Form>;
  removeQuestion: (index: number) => void;
  questionId: number;
}) => {
  const {
    fields: choicesField,
    append: appendChoices,
    remove: removeChoices,
  } = useFieldArray({
    control: control,
    name: `questions.${questionId}.choices`,
  });

  const useWatchQuestionType = useWatch({
    control,
    name: `questions.${questionId}.question_type`,
    defaultValue: 'TEXT',
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

  useEffect(() => {
    if (useWatchQuestionType === 'TEXT') {
      removeChoices();
    } else if (choicesField.length === 0) {
      // NOTE: choicesField.lengthが0であることを確認しないと
      // 単一選択 -> 複数選択 -> 単一選択のように変更した場合に選択肢の入力欄が増加してしまう
      addChoice();
    }
  }, [useWatchQuestionType, addChoice, choicesField, removeChoices]);

  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        質問{questionId + 1} (question_id: {questionId})
      </Typography>
      <Button
        variant="outlined"
        startIcon={<DeleteIcon />}
        onClick={() => removeQuestion(questionId)}
      >
        質問の削除
      </Button>
      <TextField
        {...register(`questions.${questionId}.title`)}
        label="質問タイトル"
        required
      />
      <TextField
        {...register(`questions.${questionId}.description`)}
        label="質問の説明"
      />
      <TextField
        {...register(`questions.${questionId}.question_type`)}
        label="質問の種類"
        select
        required
        defaultValue="TEXT"
        helperText="質問の種類を選択してください。"
      >
        <MenuItem value="TEXT">テキスト</MenuItem>
        <MenuItem value="SINGLE">単一選択</MenuItem>
        <MenuItem value="MULTIPLE">複数選択</MenuItem>
      </TextField>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={addChoice}
        disabled={useWatchQuestionType == 'TEXT'}
      >
        選択肢の追加
      </Button>
      {choicesField.map((field, index) => {
        return (
          <Stack direction="row" key={field.id}>
            <TextField
              {...register(`questions.${questionId}.choices.${index}.choice`)}
              key={field.id}
              label={`選択肢${index + 1}`}
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
