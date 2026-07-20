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
      <TextField
        {...props.register(`questions.${props.questionIndex}.title`)}
        label="質問タイトル"
        required
      />
      <TextField
        {...props.register(`questions.${props.questionIndex}.description`)}
        label="質問の説明"
        multiline
        helperText="Markdown に対応しています。"
      />
      <TextField
        {...props.register(`questions.${props.questionIndex}.template_key`)}
        label="テンプレートキー"
        helperText="回答タイトルへの埋め込みに使う識別キーです。半角英数字・_・- のみ使用できます（1〜255文字）。username と form_name は予約語のため使用できません。空欄のままでも構いません。"
      />
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
