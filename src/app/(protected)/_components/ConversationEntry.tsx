'use client';

import { Alert, Box, Snackbar } from '@mui/material';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import type {
  ConversationActionResult,
  ConversationCapabilities,
  ConversationEntryViewModel,
} from './conversationTypes';
import {
  CONVERSATION_ENTRY_AVATAR_SIZE,
  CONVERSATION_ENTRY_HEADER_SPACING,
} from './conversationEntryLayout';
import ConversationEntryBody from './ConversationEntryBody';
import ConversationEntryEditor from './ConversationEntryEditor';
import ConversationEntryHeader from './ConversationEntryHeader';

type Props = {
  entry: ConversationEntryViewModel;
  capabilities: ConversationCapabilities;
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
  onUpdate,
  onDelete,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const [draftBody, setDraftBody] = useState(entry.body);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: '' });

  const showError = (message: string) => setSnackbar({ open: true, message });
  const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));
  const handleOpenMenu = (event: MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(undefined);
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

  return (
    <>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={closeSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Box>
        <ConversationEntryHeader
          entry={entry}
          capabilities={capabilities}
          anchorEl={anchorEl}
          onOpenMenu={handleOpenMenu}
          onCloseMenu={handleCloseMenu}
          onStartEditing={handleStartEditing}
          onDelete={handleDelete}
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
