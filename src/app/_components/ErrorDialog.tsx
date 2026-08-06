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
import { match, P } from 'ts-pattern';

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
    match(error)
      .with(P.when(isHttpError), (e) => e.status)
      .with(P.when(isAccessError), (e) => e.status)
      .otherwise(() => null);

  const resolvedTitle =
    title ??
    match(status)
      .with(401, () => 'セッションの有効期限が切れました')
      .with(403, () => 'このページを表示する権限がありません')
      .with(503, () => '現在このページを表示できません')
      .otherwise(() => 'データ取得中にエラーが発生しました');

  const resolvedMessage =
    message ??
    match(status)
      .with(401, () => '再度サインインしてから操作をやり直してください。')
      .with(403, () => '権限のあるアカウントでサインインしてください。')
      .with(
        503,
        () => 'バックエンドに接続できないため、保護された画面を表示できません。'
      )
      .otherwise(() => '連続して発生する場合は管理者に問い合わせてください。');

  const iconColor =
    status === 401 || status === 403 ? 'warning' : ('error' as const);

  const statusIcons: Record<number, typeof ErrorIcon> = {
    403: LockOutlinedIcon,
    401: WarningAmberIcon,
  };
  const StatusIcon = (status !== null && statusIcons[status]) || ErrorIcon;

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
                color="textSecondary"
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
              onClick={
                onRetry ??
                (() => {
                  window.location.reload();
                })
              }
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
