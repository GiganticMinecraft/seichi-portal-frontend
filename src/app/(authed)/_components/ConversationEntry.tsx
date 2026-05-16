'use client';

import { Box, Typography } from '@mui/material';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import type {
  ConversationActionResult,
  ConversationCapabilities,
  ConversationEntryViewModel,
} from './conversationTypes';
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
  const [operationResultMessage, setOperationResultMessage] =
    useState<string>();

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(undefined);
  const handleStartEditing = () => {
    setOperationResultMessage(undefined);
    setIsEditing(true);
    setAnchorEl(undefined);
  };
  const handleCancelEditing = () => {
    setDraftBody(entry.body);
    setOperationResultMessage(undefined);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!onDelete) {
      return;
    }

    const result = await onDelete(entry.id);
    if (result.forbidden) {
      setOperationResultMessage('このメッセージを削除する権限がありません。');
    } else if (!result.success) {
      setOperationResultMessage(
        '不明なエラーが発生しました。もう一度お試しください。'
      );
    }
    handleCloseMenu();
  };

  const handleUpdate = async () => {
    if (!onUpdate || draftBody === '') {
      return;
    }

    const result = await onUpdate(entry.id, draftBody);
    if (result.forbidden) {
      setOperationResultMessage('このメッセージを編集する権限がありません。');
      return;
    }

    if (!result.success) {
      setOperationResultMessage(
        '不明なエラーが発生しました。もう一度お試しください。'
      );
      return;
    }

    setOperationResultMessage(undefined);
    setIsEditing(false);
  };

  return (
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

      <Box sx={{ pl: '44px', mt: 0.5 }}>
        {isEditing ? (
          <ConversationEntryEditor
            defaultValue={entry.body}
            onChange={setDraftBody}
            onSubmit={handleUpdate}
            onCancel={handleCancelEditing}
          />
        ) : (
          <ConversationEntryBody entry={entry} />
        )}
        {operationResultMessage && (
          <Typography
            variant="caption"
            component="p"
            sx={{ color: 'error.main', mt: 1 }}
          >
            {operationResultMessage}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ConversationEntry;
