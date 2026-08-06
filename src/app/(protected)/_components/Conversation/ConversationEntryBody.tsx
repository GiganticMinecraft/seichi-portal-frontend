'use client';

import { Paper } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { match } from 'ts-pattern';

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
        backgroundColor: match({ surface: entry.surface, isAdmin })
          .with({ surface: 'bubble', isAdmin: true }, () =>
            alpha(theme.palette.success.main, 0.08)
          )
          .with({ surface: 'bubble' }, () => theme.palette.grey[50])
          .otherwise(() => 'transparent'),
        borderRadius: entry.surface === 'bubble' ? 2 : 0,
        boxShadow: 'none',
      })}
    >
      <MarkdownText>{entry.body}</MarkdownText>
    </Paper>
  );
};

export default ConversationEntryBody;
