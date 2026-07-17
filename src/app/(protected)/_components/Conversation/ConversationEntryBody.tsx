'use client';

import { Paper } from '@mui/material';
import { alpha } from '@mui/material/styles';

import MarkdownText from '@/app/_components/MarkdownText';

import type { ConversationEntryViewModel } from './conversationTypes';

type Props = {
  entry: ConversationEntryViewModel;
};

const ConversationEntryBody = ({ entry }: Props) => {
  const isAdmin = entry.authorRole === 'ADMINISTRATOR';

  return (
    <Paper
      variant={entry.surface === 'bubble' ? 'outlined' : undefined}
      sx={(theme) => ({
        p: entry.surface === 'bubble' ? 1.5 : 0,
        backgroundColor:
          entry.surface === 'bubble'
            ? isAdmin
              ? alpha(theme.palette.success.main, 0.08)
              : theme.palette.grey[50]
            : 'transparent',
        borderRadius: entry.surface === 'bubble' ? 2 : 0,
        boxShadow: 'none',
      })}
    >
      <MarkdownText>{entry.body}</MarkdownText>
    </Paper>
  );
};

export default ConversationEntryBody;
