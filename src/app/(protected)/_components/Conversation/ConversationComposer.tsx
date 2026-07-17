'use client';

import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
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
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm<ComposerForm>();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: '' });
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const shouldRefocusRef = useRef(false);
  const { ref: registerRef, ...bodyRegister } = register('body');

  useEffect(() => {
    if (!isSubmitting && shouldRefocusRef.current) {
      shouldRefocusRef.current = false;
      inputRef.current?.focus();
    }
  }, [isSubmitting]);

  const onSubmit = async (data: ComposerForm) => {
    if (data.body === '') {
      return;
    }

    const result = await onSend(data.body);

    if (result.success) {
      reset({ body: '' });
      shouldRefocusRef.current = true;
    } else if (result.forbidden) {
      setSnackbar({
        open: true,
        message: 'このメッセージを送信する権限がありません。',
      });
    } else {
      setSnackbar({ open: true, message: '送信に失敗しました。' });
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
      >
        <Stack spacing={1}>
          <TextField
            {...bodyRegister}
            inputRef={(
              element: HTMLInputElement | HTMLTextAreaElement | null
            ) => {
              inputRef.current = element;
              registerRef(element);
            }}
            autoFocus
            helperText={helperText}
            disabled={isSubmitting}
            sx={
              textFieldSx
                ? [{ width: '100%' }, textFieldSx].flat()
                : { width: '100%' }
            }
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                if (isSubmitting) {
                  return;
                }
                void handleSubmit(onSubmit)();
              }
            }}
            slotProps={{
              input: {
                inputProps: { placeholder: label },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                      aria-label="送信"
                      disabled={isSubmitting}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            multiline
          />
        </Stack>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => {
          setSnackbar((prev) => ({ ...prev, open: false }));
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          onClose={() => {
            setSnackbar((prev) => ({ ...prev, open: false }));
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ConversationComposer;
