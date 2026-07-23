'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import type { Control, UseFormRegister } from 'react-hook-form';

import type { FormEditorValues } from '../../_schema/formEditorSchema';

import ChoiceEditor from './ChoiceEditor';
import FieldLabel from './FieldLabel';

const QuestionEditor = (props: {
  control: Control<FormEditorValues>;
  register: UseFormRegister<FormEditorValues>;
  removeQuestion: (index: number) => void;
  questionIndex: number;
}) => {
  return (
    <Stack spacing={2}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
        質問{props.questionIndex + 1}
      </Typography>
      <Button
        variant="outlined"
        startIcon={<DeleteIcon />}
        onClick={() => {
          props.removeQuestion(props.questionIndex);
        }}
      >
        質問の削除
      </Button>
      <Stack spacing={0.5}>
        <FieldLabel label="質問タイトル" required />
        <TextField
          {...props.register(`questions.${props.questionIndex}.title`)}
          fullWidth
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
            {...props.register(`questions.${props.questionIndex}.is_required`)}
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
