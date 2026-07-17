'use client';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Collapse, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import MarkdownText from '@/app/_components/MarkdownText';
import { formatString } from '@/generic/DateFormatter';

import {
  CONVERSATION_ENTRY_AVATAR_SIZE,
  CONVERSATION_ENTRY_HEADER_SPACING,
} from './conversationEntryLayout';
import type { ConversationDeletedEntryViewModel } from './conversationTypes';

type Props = {
  entry: ConversationDeletedEntryViewModel;
  /** エラーメッセージ等で使う、投稿を指す名詞(例: 'メッセージ' / 'コメント')。 */
  entryNoun: string;
};

/**
 * 管理者にのみ表示する、削除済みの投稿。折りたたんだ行をクリックすると
 * 最終内容・投稿者・削除者/削除日時を展開して確認できる。
 */
const DeletedConversationEntry = ({ entry, entryNoun }: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box
      sx={{
        bgcolor: 'action.hover',
        borderRadius: 1,
        px: 1.5,
        py: 1,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        component="button"
        type="button"
        aria-expanded={expanded}
        onClick={() => {
          setExpanded((prev) => !prev);
        }}
        sx={{
          alignItems: 'center',
          width: '100%',
          border: 0,
          background: 'none',
          p: 0,
          cursor: 'pointer',
          textAlign: 'left',
          color: 'inherit',
          font: 'inherit',
        }}
      >
        <DeleteOutlineIcon fontSize="small" color="disabled" />
        <Typography variant="body2" color="textSecondary" sx={{ flex: 1 }}>
          削除された{entryNoun}({entry.authorName})
        </Typography>
        {expanded ? (
          <ExpandLessIcon fontSize="small" />
        ) : (
          <ExpandMoreIcon fontSize="small" />
        )}
      </Stack>
      <Collapse in={expanded}>
        <Box
          sx={(theme) => ({
            pl: `calc(${CONVERSATION_ENTRY_AVATAR_SIZE}px + ${theme.spacing(
              CONVERSATION_ENTRY_HEADER_SPACING
            )})`,
            mt: 1,
          })}
        >
          <Typography variant="caption" color="textSecondary" component="p">
            投稿日時: {formatString(entry.timestamp)}
          </Typography>
          <Typography variant="caption" color="textSecondary" component="p">
            削除: {entry.deletedByName}({formatString(entry.deletedAt)})
          </Typography>
          <MarkdownText>{entry.body}</MarkdownText>
        </Box>
      </Collapse>
    </Box>
  );
};

export default DeletedConversationEntry;
