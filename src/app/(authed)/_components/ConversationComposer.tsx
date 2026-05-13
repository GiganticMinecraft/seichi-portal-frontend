'use client';

import SendIcon from '@mui/icons-material/Send';
import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
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
 * 投稿入力フォームを共通化する component。
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
      <Stack spacing={1}>
        <TextField
          {...register('body')}
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
          slotProps={{
            input: {
              inputProps: { placeholder: label },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" aria-label="送信">
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          multiline
        />
        {submitError && (
          <Typography sx={{ fontSize: '12px' }}>{submitError}</Typography>
        )}
      </Stack>
    </form>
  );
};

export default ConversationComposer;
