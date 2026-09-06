'use client';

import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useResizableSidebarWidth } from '@/hooks/useResizableSidebarWidth';

import ConversationEntry from './ConversationEntry';
import type {
  ConversationActionResult,
  ConversationCapabilities,
  ConversationListItem,
} from './conversationTypes';
import DeletedConversationEntry from './DeletedConversationEntry';
import { getConversationEntryDomId } from './useConversationEntryDeepLink';

const AUTO_SCROLL_DELAY_MS = 300;

type Props = {
  variant: 'drawer' | 'inline';
  title?: string | undefined;
  triggerLabel?: string | undefined;
  triggerStartIcon?: ReactNode | undefined;
  /** trigger ボタン横の i アイコンにホバーしたときに表示する、機能の説明文。 */
  triggerDescription?: string | undefined;
  /** true のとき trigger ボタンを disabled にする。 */
  triggerDisabled?: boolean | undefined;
  /** triggerDisabled が true のときに trigger ボタンのホバーで表示する理由。 */
  triggerDisabledReason?: string | undefined;
  items: ConversationListItem[];
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
    ((entryId: string) => Promise<ConversationActionResult>) | undefined;
  onDeleteAttachment?:
    ((attachmentId: string) => Promise<ConversationActionResult>) | undefined;
};

/**
 * 投稿一覧系 UI の配置責務を持つ上位 component。
 * drawer / inline のレイアウト差分と空状態、入力フォームの配置をここへ集約する。
 */
const ConversationList = ({
  items,
  capabilities,
  highlightedEntryId,
  onUpdate,
  onDelete,
  onDeleteAttachment,
}: {
  items: ConversationListItem[];
  capabilities: ConversationCapabilities;
  highlightedEntryId?: string | undefined;
  onUpdate?:
    | ((entryId: string, body: string) => Promise<ConversationActionResult>)
    | undefined;
  onDelete?:
    ((entryId: string) => Promise<ConversationActionResult>) | undefined;
  onDeleteAttachment?:
    ((attachmentId: string) => Promise<ConversationActionResult>) | undefined;
}) => (
  <Stack spacing={2}>
    {items.length === 0 && (
      <Typography color="textSecondary" align="center" sx={{ mt: 4 }}>
        {capabilities.emptyMessage}
      </Typography>
    )}
    {items.map((item) => (
      <Stack key={item.entry.id} spacing={2}>
        {item.kind === 'entry' ? (
          <ConversationEntry
            entry={item.entry}
            capabilities={capabilities}
            highlighted={item.entry.id === highlightedEntryId}
            {...(onUpdate ? { onUpdate } : {})}
            {...(onDelete ? { onDelete } : {})}
            {...(onDeleteAttachment ? { onDeleteAttachment } : {})}
          />
        ) : (
          <DeletedConversationEntry
            entry={item.entry}
            entryNoun={capabilities.entryNoun}
          />
        )}
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
  triggerDescription,
  triggerDisabled,
  triggerDisabledReason,
  items,
  capabilities,
  inputForm,
  autoOpen,
  highlightedEntryId,
  onDrawerClose,
  onUpdate,
  onDelete,
  onDeleteAttachment,
}: Props) => {
  const [open, setOpen] = useState(false);
  const hasAutoOpenedRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { paperRef, width, dragHandleProps } = useResizableSidebarWidth();

  // autoOpen は entries の再フェッチ後も true のまま残り得るため、
  // 「true になった直後の 1 回だけ開く」を hasAutoOpenedRef で保証する。
  // これにより、ユーザーが手動で閉じた drawer が再フェッチのたびに勝手に開き直すことはない。
  // autoOpen が false に戻ったとき(entryId が別の値に変わった、など)は
  // ref をリセットし、次に true になったときにまた自動で開けるようにする。
  useEffect(() => {
    if (autoOpen) {
      if (!hasAutoOpenedRef.current) {
        hasAutoOpenedRef.current = true;
        setOpen(true);
      }
    } else {
      hasAutoOpenedRef.current = false;
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

  // 直リンクによるハイライト先が無いときは、開いた直後に最新(末尾)へスクロールする。
  useEffect(() => {
    if (!open || highlightedEntryId !== undefined) {
      return;
    }
    const timer = setTimeout(() => {
      const container = scrollContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
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
        items={items}
        capabilities={capabilities}
        highlightedEntryId={highlightedEntryId}
        {...(onUpdate ? { onUpdate } : {})}
        {...(onDelete ? { onDelete } : {})}
        {...(onDeleteAttachment ? { onDeleteAttachment } : {})}
      />
    );
  }

  return (
    <>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        <Tooltip
          title={triggerDisabled ? (triggerDisabledReason ?? '') : ''}
          placement="top"
        >
          <span>
            <Button
              variant="outlined"
              onClick={() => {
                setOpen(true);
              }}
              startIcon={triggerStartIcon}
              disabled={triggerDisabled}
            >
              {triggerLabel}
            </Button>
          </span>
        </Tooltip>
        {triggerDescription !== undefined && (
          <Tooltip title={triggerDescription} placement="top">
            <IconButton size="small" aria-label="この機能について">
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            ref: paperRef,
            sx: { width: { xs: '100%', sm: width } },
          },
        }}
      >
        <Box
          {...dragHandleProps}
          sx={{
            display: { xs: 'none', sm: 'flex' },
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: -6,
            width: 12,
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'col-resize',
            touchAction: 'none',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            '&:hover > span, &:active > span': {
              bgcolor: 'primary.main',
            },
          }}
        >
          <Box
            component="span"
            sx={{
              width: 4,
              height: '100%',
              bgcolor: 'divider',
              borderRadius: 1,
            }}
          />
        </Box>

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
          ref={scrollContainerRef}
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
            items={items}
            capabilities={capabilities}
            highlightedEntryId={highlightedEntryId}
            {...(onUpdate ? { onUpdate } : {})}
            {...(onDelete ? { onDelete } : {})}
            {...(onDeleteAttachment ? { onDeleteAttachment } : {})}
          />
        </Box>

        {inputForm}
      </Drawer>
    </>
  );
};

export default ConversationSurface;
