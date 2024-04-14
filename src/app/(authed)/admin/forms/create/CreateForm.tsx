import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Container, MenuItem, Stack, TextField } from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';
import { formSchema } from '@/_schemas/formSchema';
import type { Form } from '@/_schemas/formSchema';
import SendIcon from '@mui/icons-material/Send';

export const CreateFormComponent = () => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Form>({
    // fixme: ここの型を_schemasのFormなのは適切ではなさそうなので、同ディレクトリにこのフォーム用のスキーマを定義する
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    resolver: zodResolver(formSchema),
  });

  const visibility = useWatch({
    control,
    name: 'settings.visibility',
    defaultValue: 'PUBLIC',
  });

  const onSubmit = (data: Form) => {
    // todo: データの送信処理を書く
  };

  return (
    <Container component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <TextField {...register('title')} label="フォームタイトル" required />
        <TextField
          {...register('description')}
          label="フォームの説明"
          required
        />
        <TextField
          {...register('settings.response_period.start_at')}
          label="回答開始日"
          type="datetime-local"
          helperText="回答開始日と回答終了日はどちらも指定する必要があります。"
        />
        <TextField
          {...register('settings.response_period.end_at')}
          label="回答終了日"
          type="datetime-local"
          helperText="回答開始日と回答終了日はどちらも指定する必要があります。"
        />
        <TextField
          {...register('settings.visibility')}
          label="公開設定"
          defaultValue={visibility}
          select
          required
        >
          <MenuItem value="PUBLIC">公開</MenuItem>
          <MenuItem value="PRIVATE">非公開</MenuItem>
        </TextField>
        <TextField
          {...register('settings.webhook_url')}
          label="Webhook URL"
          type="url"
        />
        {/* todo: default_answer_titleにhelper textをつける */}
        <TextField
          {...register('settings.default_answer_title')}
          label="デフォルトの回答タイトル"
        />
        <Button type="submit" variant="contained" endIcon={<SendIcon />}>
          フォーム作成
        </Button>
      </Stack>
    </Container>
  );
};
