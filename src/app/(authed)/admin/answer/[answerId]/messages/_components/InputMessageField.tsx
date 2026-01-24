import SendIcon from '@mui/icons-material/Send';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type SendMessageSchema = {
  body: string;
};

const InputMessageField = (props: { answer_id: number }) => {
  const { handleSubmit, register, reset } = useForm<SendMessageSchema>();
  const [sendFailedMessage, setSendFailedMessage] = useState<
    string | undefined
  >(undefined);

  const onSubmit = async (data: SendMessageSchema) => {
    if (data.body === '') {
      return;
    }

    const response = await fetch(
      `/api/proxy/forms/answers/${props.answer_id}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      reset({ body: '' });
      setSendFailedMessage(undefined);
    } else {
      setSendFailedMessage('送信に失敗しました');
    }
  };

  return (
    <Container component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container>
        <Grid size={11}>
          <TextField
            {...register('body')}
            label="メッセージを入力してください"
            helperText="Shift + Enter で改行、Enter で送信することができます。"
            sx={{ width: '100%' }}
            onKeyDown={async (e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();

                await handleSubmit(onSubmit)();
              }
            }}
            multiline
            required
          />
        </Grid>
        <Grid container alignItems="center" justifyContent="center" size={1}>
          <Button variant="contained" endIcon={<SendIcon />} type="submit">
            送信
          </Button>
        </Grid>
        {sendFailedMessage && (
          <Grid size={12}>
            <Typography sx={{ fontSize: '12px', marginTop: '10px' }}>
              {sendFailedMessage}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default InputMessageField;
