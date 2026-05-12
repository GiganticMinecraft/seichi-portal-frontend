'use client';

import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';
import { useState } from 'react';
import ConversationEntry from './ConversationEntry';
import type {
  ConversationActionResult,
  ConversationCapabilities,
  ConversationEntryViewModel,
} from './conversationTypes';

type Props = {
  variant: 'drawer' | 'inline';
  title?: string;
  triggerLabel?: string;
  triggerStartIcon?: ReactNode;
  entries: ConversationEntryViewModel[];
  capabilities: ConversationCapabilities;
  composer?: ReactNode;
  onUpdate?: (
    entryId: string,
    body: string
  ) => Promise<ConversationActionResult>;
  onDelete?: (entryId: string) => Promise<ConversationActionResult>;
};

/**
 * 投稿一覧系 UI の配置責務を持つ上位 component。
 * drawer / inline のレイアウト差分と空状態、composer の配置をここへ集約する。
 */
const ConversationList = ({
  entries,
  capabilities,
  onUpdate,
  onDelete,
}: {
  entries: ConversationEntryViewModel[];
  capabilities: ConversationCapabilities;
  onUpdate?: (
    entryId: string,
    body: string
  ) => Promise<ConversationActionResult>;
  onDelete?: (entryId: string) => Promise<ConversationActionResult>;
}) => (
  <Stack spacing={2}>
    {entries.length === 0 && (
      <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
        {capabilities.emptyMessage}
      </Typography>
    )}
    {entries.map((entry) => (
      <Stack key={entry.id} spacing={2}>
        <ConversationEntry
          entry={entry}
          capabilities={capabilities}
          {...(onUpdate ? { onUpdate } : {})}
          {...(onDelete ? { onDelete } : {})}
        />
        <Divider />
      </Stack>
    ))}
  </Stack>
);

/**
 * 共通化した投稿表示を、画面用途に応じたサーフェスへ載せる entry point。
 */
const ConversationSurface = ({
  variant,
  title,
  triggerLabel,
  triggerStartIcon,
  entries,
  capabilities,
  composer,
  onUpdate,
  onDelete,
}: Props) => {
  const [open, setOpen] = useState(false);

  if (variant === 'inline') {
    return (
      <ConversationList
        entries={entries}
        capabilities={capabilities}
        {...(onUpdate ? { onUpdate } : {})}
        {...(onDelete ? { onDelete } : {})}
      />
    );
  }

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        startIcon={triggerStartIcon}
      >
        {triggerLabel}
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: { sx: { width: { xs: '100%', sm: 400 } } },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Toolbar>

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <ConversationList
            entries={entries}
            capabilities={capabilities}
            {...(onUpdate ? { onUpdate } : {})}
            {...(onDelete ? { onDelete } : {})}
          />
        </Box>

        {composer}
      </Drawer>
    </>
  );
};

export default ConversationSurface;
