'use client';

import { Box, Paper, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ConversationEntryViewModel } from './conversationTypes';

type Props = {
  entry: ConversationEntryViewModel;
};

const ConversationEntryBody = ({ entry }: Props) => {
  const isAdmin = entry.authorRole === 'ADMINISTRATOR';

  return (
    <Paper
      variant={entry.renderMode === 'plain' ? 'outlined' : undefined}
      sx={(theme) => ({
        p: entry.renderMode === 'plain' ? 1.5 : 0,
        backgroundColor:
          entry.renderMode === 'plain'
            ? isAdmin
              ? alpha(theme.palette.success.main, 0.08)
              : theme.palette.grey[50]
            : 'transparent',
        borderRadius: entry.renderMode === 'plain' ? 2 : 0,
        boxShadow: 'none',
      })}
    >
      {entry.renderMode === 'markdown' ? (
        <Box sx={{ whiteSpace: 'pre-wrap' }}>
          <Markdown remarkPlugins={[remarkGfm]}>{entry.body}</Markdown>
        </Box>
      ) : (
        <Typography
          variant="body2"
          component="p"
          sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
        >
          {entry.body}
        </Typography>
      )}
    </Paper>
  );
};

export default ConversationEntryBody;
