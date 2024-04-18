import { MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useWatch } from 'react-hook-form';
import type { Form } from '../_schema/createFormSchema';
import type { Control, UseFormRegister } from 'react-hook-form';

const FormSettings = (props: {
  control: Control<Form>;
  register: UseFormRegister<Form>;
}) => {
  const visibility = useWatch({
    control: props.control,
    name: 'settings.visibility',
    defaultValue: 'PUBLIC',
  });

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
      />
      <TextField
        {...props.register('settings.response_period.start_at')}
        label="回答開始日"
        type="datetime-local"
        helperText="回答開始日と回答終了日はどちらも指定する必要があります。"
      />
      <TextField
        {...props.register('settings.response_period.end_at')}
        label="回答終了日"
        type="datetime-local"
        helperText="回答開始日と回答終了日はどちらも指定する必要があります。"
      />
      <TextField
        {...props.register('settings.visibility')}
        label="公開設定"
        defaultValue={visibility}
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
        helperText="回答が送信されたときに設定されるタイトルで、$[question_id]で指定の質問の回答をタイトルに埋め込むことができます。"
      />
    </Stack>
  );
};

export default FormSettings;
