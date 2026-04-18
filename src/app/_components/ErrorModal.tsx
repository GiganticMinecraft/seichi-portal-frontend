'use client';

import { Button, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useState } from 'react';
import { isHttpError } from '@/lib/httpError';

type ErrorModalProps = {
  error?: unknown;
  message?: string;
  title?: string;
  onRetry?: () => void;
  retryLabel?: string;
  showDiagnostics?: boolean;
};

const ErrorModal = ({
  error,
  message,
  title,
  onRetry,
  retryLabel = '再試行',
  showDiagnostics = true,
}: ErrorModalProps) => {
  const [timestamp] = useState(() => dayjs().format());
  const [path] = useState(() =>
    typeof window !== 'undefined' ? window.location.href : ''
  );
  const status = isHttpError(error) ? error.status : null;

  const resolvedTitle =
    title ??
    (status === 401
      ? 'セッションの有効期限が切れました。'
      : status === 403
        ? 'このページを表示する権限がありません。'
        : 'データ取得中にエラーが発生しました。');
  const resolvedMessage =
    message ??
    (status === 401
      ? '再度サインインしてから操作をやり直してください。'
      : status === 403
        ? '権限のあるアカウントでサインインしてください。'
        : '連続して発生する場合は管理者に問い合わせてください。');

  return (
    <Modal open={true}>
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'secondary',
          display: 'grid',
          gridTemplateColumns: { md: '1fr 1fr' },
          gap: 2,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Stack>
          <Typography>{resolvedTitle}</Typography>
          <Typography>{resolvedMessage}</Typography>
          {showDiagnostics ? (
            <Typography>timestamp: {timestamp}</Typography>
          ) : null}
          {showDiagnostics ? (
            <Typography>current URL: {path}</Typography>
          ) : null}
          {status !== null ? <Typography>status: {status}</Typography> : null}
          {onRetry ? (
            <Button
              sx={{ mt: 2, width: 'fit-content' }}
              variant="contained"
              onClick={onRetry}
            >
              {retryLabel}
            </Button>
          ) : null}
        </Stack>
      </Box>
    </Modal>
  );
};

export default ErrorModal;
