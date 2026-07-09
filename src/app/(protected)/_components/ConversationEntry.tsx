'use client';

import { Alert, Box, Snackbar } from '@mui/material';
import type { MouseEvent } from 'react';
import { useState } from 'react';

import ConversationEntryBody from './ConversationEntryBody';
import ConversationEntryEditor from './ConversationEntryEditor';
import ConversationEntryHeader from './ConversationEntryHeader';
import {
  CONVERSATION_ENTRY_AVATAR_SIZE,
  CONVERSATION_ENTRY_HEADER_SPACING,
} from './conversationEntryLayout';
import type {
  ConversationActionResult,
  ConversationCapabilities,
  ConversationEntryViewModel,
} from './conversationTypes';
import { getConversationEntryDomId } from './useConversationEntryDeepLink';

type Props = {
  entry: ConversationEntryViewModel;
  capabilities: ConversationCapabilities;
  /** 直リンクで指定された entry かどうか。true の間だけ一時的な背景色でハイライトする。 */
  highlighted?: boolean;
  onUpdate?: (
    entryId: string,
    body: string
  ) => Promise<ConversationActionResult>;
  onDelete?: (entryId: string) => Promise<ConversationActionResult>;
};

/**
 * 投稿 1 件表示を共通化する component。
 * entry と capabilities だけを見て描画し、API 差分は持ち込まない。
 */
const ConversationEntry = ({
  entry,
  capabilities,
  highlighted = false,
  onUpdate,
  onDelete,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const [draftBody, setDraftBody] = useState(entry.body);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'success';
  }>({ open: false, message: '', severity: 'error' });

  const showError = (message: string) => {
    setSnackbar({ open: true, message, severity: 'error' });
  };
  const showSuccess = (message: string) => {
    setSnackbar({ open: true, message, severity: 'success' });
  };
  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(undefined);
  };
  const handleStartEditing = () => {
    setDraftBody(entry.body);
    setIsEditing(true);
    handleCloseMenu();
  };
  const handleCancelEditing = () => {
    setDraftBody(entry.body);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!onDelete) {
      return;
    }

    const result = await onDelete(entry.id);
    if (result.forbidden) {
      showError('このメッセージを削除する権限がありません。');
    } else if (!result.success) {
      showError('不明なエラーが発生しました。もう一度お試しください。');
    }
    handleCloseMenu();
  };

  const handleUpdate = async () => {
    if (!onUpdate || draftBody === '') {
      return;
    }

    const result = await onUpdate(entry.id, draftBody);
    if (result.forbidden) {
      showError('このメッセージを編集する権限がありません。');
      return;
    }

    if (!result.success) {
      showError('不明なエラーが発生しました。もう一度お試しください。');
      return;
    }

    setIsEditing(false);
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showSuccess('リンクをコピーしました');
    } catch {
      showError('リンクのコピーに失敗しました。もう一度お試しください。');
    }
  };

  return (
    <>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={closeSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Box
        id={getConversationEntryDomId(entry.id)}
        sx={{
          transition: 'background-color 0.6s ease',
          bgcolor: highlighted ? 'action.selected' : 'transparent',
          borderRadius: 1,
        }}
      >
        <ConversationEntryHeader
          entry={entry}
          capabilities={capabilities}
          anchorEl={anchorEl}
          onOpenMenu={handleOpenMenu}
          onCloseMenu={handleCloseMenu}
          onStartEditing={handleStartEditing}
          onDelete={handleDelete}
          onCopyLink={(url) => void handleCopyLink(url)}
        />

        <Box
          sx={(theme) => ({
            pl: `calc(${CONVERSATION_ENTRY_AVATAR_SIZE}px + ${theme.spacing(
              CONVERSATION_ENTRY_HEADER_SPACING
            )})`,
            mt: 0.5,
          })}
        >
          {isEditing ? (
            <ConversationEntryEditor
              value={draftBody}
              onChange={setDraftBody}
              onSubmit={handleUpdate}
              onCancel={handleCancelEditing}
            />
          ) : (
            <ConversationEntryBody entry={entry} />
          )}
        </Box>
      </Box>
    </>
  );
};

export default ConversationEntry;
