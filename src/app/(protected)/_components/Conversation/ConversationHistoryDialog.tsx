'use client';

import CloseIcon from '@mui/icons-material/Close';
import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

import MarkdownText from '@/app/_components/MarkdownText';
import { formatString } from '@/generic/DateFormatter';

import type {
  ConversationHistoryAction,
  ConversationHistoryEntryViewModel,
} from './conversationTypes';

const ACTION_LABEL: Record<ConversationHistoryAction, string> = {
  CREATE: '投稿',
  UPDATE: '更新',
  DELETE: '削除',
};

const ACTION_COLOR: Record<
  ConversationHistoryAction,
  'success' | 'info' | 'error'
> = {
  CREATE: 'success',
  UPDATE: 'info',
  DELETE: 'error',
};

const ACTION_CONTENT_LABEL: Record<ConversationHistoryAction, string> = {
  CREATE: '投稿内容',
  UPDATE: '更新後の内容',
  DELETE: '削除された内容',
};

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  entries: ConversationHistoryEntryViewModel[];
};

/**
 * 1 件のコメント/メッセージに紐づく変更履歴 (作成/更新/削除) を古い順に一覧表示する Dialog。
 * entries は呼び出し側で対象 id にフィルタ済みのものを渡す。
 */
const ConversationHistoryDialog = ({
  open,
  onClose,
  title,
  entries,
}: Props) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {title}
      <IconButton aria-label="閉じる" onClick={onClose} size="small">
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers sx={{ maxHeight: '70vh' }}>
      {entries.length === 0 ? (
        <Typography
          component="p"
          color="textSecondary"
          align="center"
          sx={{ py: 2 }}
        >
          履歴がありません
        </Typography>
      ) : (
        <Stack divider={<Divider />} spacing={1.5}>
          {entries.map((entry) => {
            const showOriginalPost =
              entry.action !== 'CREATE' &&
              (entry.operatedByName !== entry.originalAuthorName ||
                entry.operatedAt !== entry.originalTimestamp);

            return (
              <Stack key={entry.id} spacing={0.5}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center', flexWrap: 'wrap' }}
                >
                  <Chip
                    label={ACTION_LABEL[entry.action]}
                    color={ACTION_COLOR[entry.action]}
                    size="small"
                  />
                  <Typography variant="subtitle2" component="span">
                    {entry.operatedByName}
                  </Typography>
                  {entry.operatedByRole === 'ADMINISTRATOR' && (
                    <Chip label="運営チーム" color="success" size="small" />
                  )}
                  <Typography
                    variant="caption"
                    component="span"
                    color="textSecondary"
                  >
                    {formatString(entry.operatedAt)}
                  </Typography>
                </Stack>
                {showOriginalPost && (
                  <Typography
                    variant="caption"
                    component="p"
                    color="textSecondary"
                  >
                    元の投稿: {entry.originalAuthorName}
                    {entry.originalAuthorRole === 'ADMINISTRATOR' &&
                      '(運営チーム)'}
                    ({formatString(entry.originalTimestamp)})
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  component="p"
                  sx={{ fontWeight: 600 }}
                >
                  {ACTION_CONTENT_LABEL[entry.action]}
                </Typography>
                <MarkdownText>{entry.body}</MarkdownText>
              </Stack>
            );
          })}
        </Stack>
      )}
    </DialogContent>
  </Dialog>
);

export default ConversationHistoryDialog;
