'use client';

import SendIcon from '@mui/icons-material/Send';
import { Button, Grid, TextField, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { ConversationActionResult } from './conversationTypes';

type ComposerForm = {
  body: string;
};

type Props = {
  label: string;
  helperText: string;
  onSend: (body: string) => Promise<ConversationActionResult>;
  textFieldSx?: SxProps<Theme>;
};

/**
 * 投稿入力欄を共通化する composer。
 * Enter / Shift+Enter の送信体験と送信エラー表示をここで統一する。
 */
const ConversationComposer = ({
  label,
  helperText,
  onSend,
  textFieldSx,
}: Props) => {
  const { handleSubmit, register, reset } = useForm<ComposerForm>();
  const [submitError, setSubmitError] = useState<string>();

  const onSubmit = async (data: ComposerForm) => {
    if (data.body === '') {
      return;
    }

    const result = await onSend(data.body);

    if (result.success) {
      reset({ body: '' });
      setSubmitError(undefined);
    } else if (result.forbidden) {
      setSubmitError('このメッセージを送信する権限がありません。');
    } else {
      setSubmitError('送信に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container>
        <Grid size={{ xs: 12, sm: 11 }}>
          <TextField
            {...register('body')}
            label={label}
            helperText={helperText}
            sx={{ width: '100%', ...textFieldSx }}
            onKeyDown={async (event) => {
              if (
                event.key === 'Enter' &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                await handleSubmit(onSubmit)();
              }
            }}
            multiline
            required
          />
        </Grid>
        <Grid
          container
          size={{ xs: 12, sm: 1 }}
          sx={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <Button variant="contained" endIcon={<SendIcon />} type="submit">
            送信
          </Button>
        </Grid>
        {submitError && (
          <Grid size={12}>
            <Typography sx={{ fontSize: '12px', marginTop: '10px' }}>
              {submitError}
            </Typography>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default ConversationComposer;
