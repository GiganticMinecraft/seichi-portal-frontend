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
import { useCallback, useEffect, useRef, useState } from 'react';

import ConversationEntry from './ConversationEntry';
import type {
  ConversationActionResult,
  ConversationCapabilities,
  ConversationEntryViewModel,
} from './conversationTypes';
import { getConversationEntryDomId } from './useConversationEntryDeepLink';

const AUTO_SCROLL_DELAY_MS = 300;

type Props = {
  variant: 'drawer' | 'inline';
  title?: string | undefined;
  triggerLabel?: string | undefined;
  triggerStartIcon?: ReactNode | undefined;
  entries: ConversationEntryViewModel[];
  capabilities: ConversationCapabilities;
  inputForm?: ReactNode | undefined;
  /** true になった最初の 1 回だけ drawer を自動的に開く(直リンク経由の自動オープン用)。 */
  autoOpen?: boolean | undefined;
  /** 一時的にハイライト表示し、自動スクロール先にもなる entry id。 */
  highlightedEntryId?: string | undefined;
  /** drawer が(手動・自動問わず)閉じられたときに呼ばれる。URL クエリの後始末に使う。 */
  onDrawerClose?: (() => void) | undefined;
  onUpdate?:
    | ((entryId: string, body: string) => Promise<ConversationActionResult>)
    | undefined;
  onDelete?:
    | ((entryId: string) => Promise<ConversationActionResult>)
    | undefined;
};

/**
 * 投稿一覧系 UI の配置責務を持つ上位 component。
 * drawer / inline のレイアウト差分と空状態、入力フォームの配置をここへ集約する。
 */
const ConversationList = ({
  entries,
  capabilities,
  highlightedEntryId,
  onUpdate,
  onDelete,
}: {
  entries: ConversationEntryViewModel[];
  capabilities: ConversationCapabilities;
  highlightedEntryId?: string | undefined;
  onUpdate?:
    | ((entryId: string, body: string) => Promise<ConversationActionResult>)
    | undefined;
  onDelete?:
    | ((entryId: string) => Promise<ConversationActionResult>)
    | undefined;
}) => (
  <Stack spacing={2}>
    {entries.length === 0 && (
      <Typography color="textSecondary" align="center" sx={{ mt: 4 }}>
        {capabilities.emptyMessage}
      </Typography>
    )}
    {entries.map((entry) => (
      <Stack key={entry.id} spacing={2}>
        <ConversationEntry
          entry={entry}
          capabilities={capabilities}
          highlighted={entry.id === highlightedEntryId}
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
  inputForm,
  autoOpen,
  highlightedEntryId,
  onDrawerClose,
  onUpdate,
  onDelete,
}: Props) => {
  const [open, setOpen] = useState(false);
  const hasAutoOpenedRef = useRef(false);

  // autoOpen は entries の再フェッチ後も true のまま残り得るため、
  // 「最初に true になったときだけ開く」を hasAutoOpenedRef で保証する。
  // これにより、ユーザーが手動で閉じた drawer が再フェッチのたびに勝手に開き直すことはない。
  useEffect(() => {
    if (autoOpen && !hasAutoOpenedRef.current) {
      hasAutoOpenedRef.current = true;
      setOpen(true);
    }
  }, [autoOpen]);

  useEffect(() => {
    if (!open || highlightedEntryId === undefined) {
      return;
    }
    const timer = setTimeout(() => {
      document
        .getElementById(getConversationEntryDomId(highlightedEntryId))
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, AUTO_SCROLL_DELAY_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [open, highlightedEntryId]);

  const handleClose = useCallback(() => {
    setOpen(false);
    onDrawerClose?.();
  }, [onDrawerClose]);

  if (variant === 'inline') {
    return (
      <ConversationList
        entries={entries}
        capabilities={capabilities}
        highlightedEntryId={highlightedEntryId}
        {...(onUpdate ? { onUpdate } : {})}
        {...(onDelete ? { onDelete } : {})}
      />
    );
  }

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => {
          setOpen(true);
        }}
        startIcon={triggerStartIcon}
      >
        {triggerLabel}
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
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
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          <IconButton aria-label="閉じる" onClick={handleClose}>
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
            highlightedEntryId={highlightedEntryId}
            {...(onUpdate ? { onUpdate } : {})}
            {...(onDelete ? { onDelete } : {})}
          />
        </Box>

        {inputForm}
      </Drawer>
    </>
  );
};

export default ConversationSurface;
