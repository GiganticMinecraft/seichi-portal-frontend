'use client';

import { Alert, Box, Snackbar } from '@mui/material';
import type { KeyboardEvent, MouseEvent } from 'react';
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

  // 編集中に Esc でキャンセルする際、キー入力の実際のフォーカス位置に依存せず
  // 確実に検知するための capture フェーズ handler。
  //
  // 背景: 「編集」メニュー選択直後は、TextField の autoFocus (commit フェーズで同期実行)と
  // MUI Menu の Unstable_TrapFocus によるフォーカス復帰 (passive effect のクリーンアップで
  // 非同期に実行され、フォーカスを元の IconButton へ戻す)が競合し、最終的なフォーカスが
  // TextField ではなく IconButton に残ることがある。この状態で Esc を押すと、keydown は
  // IconButton から発生するため、TextField 側の onKeyDown では検知できず、
  // Drawer(MUI Modal)の Escape 検知まで伝播して Drawer ごと閉じてしまう(#837)。
  // 祖先である本 Box の capture フェーズで検知すれば、実際に keydown が発生した要素が
  // TextField・IconButton のどちらであっても、bubble で Drawer へ届く前に確実に止められる。
  //
  // ただし capture フェーズで奪う都合上、次の2つを除外しないと別の操作を壊す:
  // - anchorEl が設定されている(「その他の操作」メニューが開いている)間の Esc は、
  //   メニュー自身を閉じるための入力である。ここで奪ってしまうとメニューの Escape
  //   クローズ(Menu 自身の onKeyDown)にイベントが届かず、メニューが閉じ残ったまま
  //   編集だけがキャンセルされてしまう。
  // - IME 変換中(isComposing)の Esc は変換候補のキャンセルであり、編集キャンセルの
  //   意図ではない(Enter の確定判定と同様の理由)。
  const handleEditKeyDownCapture = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      isEditing &&
      anchorEl === undefined &&
      event.key === 'Escape' &&
      !event.nativeEvent.isComposing
    ) {
      event.stopPropagation();
      handleCancelEditing();
    }
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
        onKeyDownCapture={handleEditKeyDownCapture}
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
