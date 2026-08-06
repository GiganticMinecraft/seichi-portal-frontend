'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  FormControlLabel,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { useController, useFormState, useWatch } from 'react-hook-form';
import type { Control, UseFormRegister } from 'react-hook-form';

import FieldLabel from '@/app/_components/FieldLabel';

import type { FormEditorValues } from '../../_schema/formEditorSchema';

import ChoiceEditor from './ChoiceEditor';

const QuestionEditor = (props: {
  control: Control<FormEditorValues>;
  register: UseFormRegister<FormEditorValues>;
  removeQuestion: (index: number) => void;
  questionIndex: number;
  removeDisabled: boolean;
}) => {
  const { field: isRequiredField } = useController({
    control: props.control,
    name: `questions.${props.questionIndex}.is_required`,
  });
  const isRequired = useWatch({
    control: props.control,
    name: `questions.${props.questionIndex}.is_required`,
  });
  const { errors } = useFormState({
    control: props.control,
    name: `questions.${props.questionIndex}.title`,
  });
  const titleError = errors.questions?.[props.questionIndex]?.title;

  return (
    <Stack spacing={2}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
        質問{props.questionIndex + 1}
      </Typography>
      <Tooltip
        title={props.removeDisabled ? '質問は最低1つ必要です' : ''}
        placement="top"
      >
        <span>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            disabled={props.removeDisabled}
            onClick={() => {
              props.removeQuestion(props.questionIndex);
            }}
          >
            質問の削除
          </Button>
        </span>
      </Tooltip>
      <Stack spacing={0.5}>
        <FieldLabel label="質問タイトル" required />
        <TextField
          {...props.register(`questions.${props.questionIndex}.title`)}
          fullWidth
          error={Boolean(titleError)}
          helperText={titleError?.message}
          slotProps={{ htmlInput: { 'aria-label': '質問タイトル' } }}
        />
      </Stack>
      <Stack spacing={0.5}>
        <FieldLabel label="質問の説明" />
        <TextField
          {...props.register(`questions.${props.questionIndex}.description`)}
          multiline
          helperText="Markdown に対応しています。"
          slotProps={{ htmlInput: { 'aria-label': '質問の説明' } }}
        />
      </Stack>
      <Stack spacing={0.5}>
        <FieldLabel label="テンプレートキー" />
        <TextField
          {...props.register(`questions.${props.questionIndex}.template_key`)}
          helperText="回答タイトルへの埋め込みに使う識別キーです。半角英数字・_・- のみ使用できます（1〜255文字）。username と form_name は予約語のため使用できません。空欄のままでも構いません。"
          slotProps={{ htmlInput: { 'aria-label': 'テンプレートキー' } }}
        />
      </Stack>
      <FormControlLabel
        label="この質問への回答を必須にする"
        control={
          <Checkbox
            checked={isRequired}
            onChange={(_, checked) => {
              isRequiredField.onChange(checked);
            }}
          />
        }
      />
      <ChoiceEditor
        control={props.control}
        register={props.register}
        questionIndex={props.questionIndex}
      />
    </Stack>
  );
};

export default QuestionEditor;
