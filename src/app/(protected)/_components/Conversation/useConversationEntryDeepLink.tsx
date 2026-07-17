'use client';

import { Alert, Snackbar } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import type { ConversationEntryViewModel } from './conversationTypes';

/**
 * ページ側で `useSearchParams` から読み取った、直リンク対象の entry id とその
 * クリア方法(URL からクエリパラメータを取り除く処理)を Messages/Comments へ渡すための形。
 */
export type ConversationDeepLinkProps = {
  entryId: string | undefined;
  onClose: () => void;
};

export type ConversationDeepLinkState = {
  autoOpen: boolean;
  highlightedEntryId: string | undefined;
  notFoundMessage: string | undefined;
  dismissNotFoundMessage: () => void;
  onDrawerClose: () => void;
};

const HIGHLIGHT_DURATION_MS = 2500;

/**
 * entry の DOM 要素へ付与する id を一箇所で決める。
 * scrollIntoView 対象の特定(ConversationSurface)と実際の id 付与(ConversationEntry)で
 * 生成ロジックがずれないようにするための共有ヘルパー。
 */
export const getConversationEntryDomId = (entryId: string) =>
  `conversation-entry-${entryId}`;

/**
 * `?messageId=`/`?commentId=` などの直リンククエリと entries を突き合わせ、
 * entryId が変わるたびに自動オープン・ハイライトを発火させる共有ロジック。
 *
 * entries は refreshInterval による再フェッチのたびに新しい参照になるため、
 * 「同じ entryId に対する多重解決」は防ぐ必要がある一方、entryId 自体が
 * 別の値に変わった場合(同一ページ内で別の直リンクに切り替わる、ブラウザの
 * 戻る操作でクエリが変わる、など)は改めて解決し直す必要がある。
 * そのため「一度でも解決したか」ではなく「直前に処理した entryId」を
 * prevEntryId として保持し、entryId !== prevEntryId のときだけ処理する。
 *
 * useEffect + setState ではなく、React が公式に案内するレンダー中に state を
 * 調整するパターンを使う。同じレンダーの間に prevEntryId も確定するため、
 * 無限ループにはならない。
 */
export const useConversationEntryDeepLink = (
  deepLink: ConversationDeepLinkProps,
  entries: ConversationEntryViewModel[],
  notFoundLabel: string
): ConversationDeepLinkState => {
  const { entryId, onClose } = deepLink;

  const [prevEntryId, setPrevEntryId] = useState<string>();
  const [autoOpen, setAutoOpen] = useState(false);
  const [highlightedEntryId, setHighlightedEntryId] = useState<string>();
  const [notFoundMessage, setNotFoundMessage] = useState<string>();

  if (entryId !== prevEntryId) {
    setPrevEntryId(entryId);

    if (entryId !== undefined) {
      if (entries.some((entry) => entry.id === entryId)) {
        setAutoOpen(true);
        setHighlightedEntryId(entryId);
        setNotFoundMessage(undefined);
      } else {
        setAutoOpen(false);
        setHighlightedEntryId(undefined);
        setNotFoundMessage(
          `指定された${notFoundLabel}が見つかりませんでした。`
        );
      }
    } else {
      setAutoOpen(false);
      setHighlightedEntryId(undefined);
      setNotFoundMessage(undefined);
    }
  }

  useEffect(() => {
    if (highlightedEntryId === undefined) {
      return;
    }
    const timer = setTimeout(() => {
      setHighlightedEntryId(undefined);
    }, HIGHLIGHT_DURATION_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [highlightedEntryId]);

  const dismissNotFoundMessage = useCallback(() => {
    setNotFoundMessage(undefined);
  }, []);

  return {
    autoOpen,
    highlightedEntryId,
    notFoundMessage,
    dismissNotFoundMessage,
    onDrawerClose: onClose,
  };
};

/**
 * 直リンク対象が見つからなかった場合のエラー通知。
 * Messages/Comments で表示内容を重複させないための共有 component。
 */
export const ConversationDeepLinkNotice = ({
  message,
  onClose,
}: {
  message: string | undefined;
  onClose: () => void;
}) => (
  <Snackbar
    open={message !== undefined}
    autoHideDuration={6000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Alert severity="error" onClose={onClose}>
      {message ?? ''}
    </Alert>
  </Snackbar>
);
