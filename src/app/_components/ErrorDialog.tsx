'use client';

import ErrorIcon from '@mui/icons-material/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useState } from 'react';
import { isAccessError } from '@/lib/accessError';
import { isHttpError } from '@/lib/httpError';

type ErrorDialogProps = {
  error?: unknown;
  status?: number;
  message?: string;
  title?: string;
  onRetry?: () => void;
  retryLabel?: string;
  showDiagnostics?: boolean;
};

const ErrorDialog = ({
  error,
  status: statusProp,
  message,
  title,
  onRetry,
  retryLabel = '再試行',
  showDiagnostics = true,
}: ErrorDialogProps) => {
  const [timestamp] = useState(() => dayjs().format());
  const [path] = useState(() =>
    typeof window !== 'undefined' ? window.location.href : ''
  );
  const status =
    statusProp ??
    (isHttpError(error)
      ? error.status
      : isAccessError(error)
        ? error.status
        : null);

  const resolvedTitle =
    title ??
    (status === 401
      ? 'セッションの有効期限が切れました'
      : status === 403
        ? 'このページを表示する権限がありません'
        : status === 503
          ? '現在このページを表示できません'
          : 'データ取得中にエラーが発生しました');

  const resolvedMessage =
    message ??
    (status === 401
      ? '再度サインインしてから操作をやり直してください。'
      : status === 403
        ? '権限のあるアカウントでサインインしてください。'
        : status === 503
          ? 'バックエンドに接続できないため、保護された画面を表示できません。'
          : '連続して発生する場合は管理者に問い合わせてください。');

  const iconColor =
    status === 401 || status === 403 ? 'warning' : ('error' as const);

  const StatusIcon =
    status === 403
      ? LockOutlinedIcon
      : status === 401
        ? WarningAmberIcon
        : ErrorIcon;

  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <StatusIcon color={iconColor} />
          <span>{resolvedTitle}</span>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{resolvedMessage}</DialogContentText>
        {showDiagnostics && (
          <Accordion
            elevation={0}
            disableGutters
            sx={{
              mt: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="caption"
                component="span"
                color="text.secondary"
              >
                詳細情報
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={0.5}>
                <Typography
                  variant="caption"
                  component="p"
                  sx={{ fontFamily: 'monospace' }}
                >
                  日時: {timestamp}
                </Typography>
                <Typography
                  variant="caption"
                  component="p"
                  sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                >
                  URL: {path}
                </Typography>
                {status !== null && (
                  <Typography
                    variant="caption"
                    component="p"
                    sx={{ fontFamily: 'monospace' }}
                  >
                    ステータス: {status}
                  </Typography>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
        )}
      </DialogContent>
      <DialogActions>
        {status === 401 && (
          <Button variant="contained" component={Link} href="/">
            サインインページへ
          </Button>
        )}
        {status === 403 && (
          <Button variant="contained" component={Link} href="/">
            ホームへ戻る
          </Button>
        )}
        {status !== 401 && status !== 403 && (
          <>
            <Button variant="outlined" component={Link} href="/">
              ホームへ戻る
            </Button>
            <Button
              variant="contained"
              onClick={onRetry ?? (() => window.location.reload())}
            >
              {onRetry ? retryLabel : 'ページを再読み込み'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;
