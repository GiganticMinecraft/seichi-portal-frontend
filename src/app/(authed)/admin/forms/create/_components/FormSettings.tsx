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
import type { GetFormLabelsResponse } from '@/lib/api-types';
import type {
  FormEditorValues,
  FormVisibility,
} from '../../_schema/formEditorSchema';
import type { Control, UseFormRegister } from 'react-hook-form';

const FormSettings = (props: {
  control: Control<FormEditorValues>;
  register: UseFormRegister<FormEditorValues>;
  visibility: FormVisibility;
  has_response_period: boolean;
  labelOptions: GetFormLabelsResponse;
}) => {
  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        フォーム設定
      </Typography>
      <TextField
        {...props.register('title')}
        label="フォームタイトル"
        required
      />
      <TextField
        {...props.register('description')}
        label="フォームの説明"
        required
        multiline
      />
      <FormLabelField
        control={props.control}
        labelOptions={props.labelOptions}
      />
      <FormControlLabel
        label="回答開始日と回答終了日を設定する"
        control={
          <Checkbox {...props.register('settings.has_response_period')} />
        }
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
        defaultValue={props.visibility}
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
        helperText="回答送信時のタイトルを設定します。$<テンプレートキー> で指定の質問の回答を、$username で回答者名をタイトルに埋め込むことができます。例: $username さんの回答"
      />
    </Stack>
  );
};

export default FormSettings;
