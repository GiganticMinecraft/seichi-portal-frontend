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
      variant="outlined"
      sx={(theme) => ({
        p: 1.5,
        backgroundColor: isAdmin
          ? alpha(theme.palette.success.main, 0.08)
          : theme.palette.grey[50],
        borderRadius: 2,
        boxShadow: 'none',
        ...(!isAdmin &&
          theme.applyStyles('dark', {
            backgroundColor: '#122131',
          })),
      })}
    >
      <MarkdownText>{entry.body}</MarkdownText>
    </Paper>
  );
};

export default ConversationEntryBody;
