'use client';

import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import FormLabelField from './FormLabelField';
import type { Form, Visibility } from '../_schema/editFormSchema';
import type { GetFormLabelsResponse } from '@/app/api/_schemas/ResponseSchemas';
import type { UseFormRegister } from 'react-hook-form';

const FormSettings = (props: {
  register: UseFormRegister<Form>;
  visibility: Visibility;
  answerVisibility: Visibility;
  has_response_period: boolean;
  formId: number;
  labelOptions: GetFormLabelsResponse;
  currentLabels: GetFormLabelsResponse;
}) => (
  <Stack spacing={2}>
    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
      フォーム設定
    </Typography>
    <TextField {...props.register('title')} label="フォームタイトル" required />
    <TextField
      {...props.register('description')}
      label="フォームの説明"
      required
      multiline
    />
    <FormLabelField
      currentLabels={props.currentLabels}
      formId={props.formId}
      labelOptions={props.labelOptions}
    />
    <FormControlLabel
      label="回答開始日と回答終了日を設定する"
      control={<Checkbox {...props.register('settings.has_response_period')} />}
    />
    <TextField
      {...props.register('settings.response_period.start_at')}
      label="回答開始日"
      type="datetime-local"
      helperText="回答開始日と回答終了日はどちらも指定する必要があります。"
      disabled={!props.has_response_period}
    />
    <TextField
      {...props.register('settings.response_period.end_at')}
      label="回答終了日"
      type="datetime-local"
      helperText="回答開始日と回答終了日はどちらも指定する必要があります。"
      disabled={!props.has_response_period}
    />
    <TextField
      {...props.register('settings.visibility')}
      label="フォーム公開設定"
      defaultValue={props.visibility}
      helperText="この設定を公開にすると、一般ユーザーがこのフォームに回答できるようになります。"
      select
      required
    >
      <MenuItem value="PUBLIC">公開</MenuItem>
      <MenuItem value="PRIVATE">非公開</MenuItem>
    </TextField>
    <TextField
      {...props.register('settings.answer_visibility')}
      label="回答の公開設定"
      defaultValue={props.answerVisibility}
      helperText="この設定を公開にすると、すべての回答が一般ユーザーから確認できるようになります。"
      select
      required
    >
      <MenuItem value="PUBLIC">公開</MenuItem>
      <MenuItem value="PRIVATE">非公開</MenuItem>
    </TextField>
    <TextField
      {...props.register('settings.webhook_url')}
      label="Webhook URL"
      type="url"
    />
    <TextField
      {...props.register('settings.default_answer_title')}
      label="デフォルトの回答タイトル"
      helperText="回答が送信されたときに設定されるタイトルで、$question_idで指定の質問の回答をタイトルに埋め込むことができます。"
    />
  </Stack>
);

export default FormSettings;
