'use client';

export type ConversationActionResult = {
  success: boolean;
  forbidden?: boolean;
};

/**
 * 投稿一覧系 UI が受け取る共通表示モデル。
 * API response は画面側でこの形へ写像してから渡す。
 */
export type ConversationEntryViewModel = {
  id: string;
  body: string;
  authorName: string;
  authorId?: string;
  authorRole: string;
  timestamp: string;
  renderMode: 'plain' | 'markdown';
  canDelete: boolean;
  canEdit: boolean;
};

/** 投稿一覧の直リンクに使う URL クエリパラメータ名。 */
export type ConversationDeepLinkQueryParam = 'messageId' | 'commentId';

/**
 * 投稿一覧系 UI の振る舞い差分を props で表現するための設定。
 * 見た目ではなく操作体験の違いをここへ閉じ込める。
 */
export type ConversationCapabilities = {
  canCompose: boolean;
  composeLabel: string;
  composeHelperText: string;
  emptyMessage: string;
  adminLabel: string;
  deepLinkQueryParam: ConversationDeepLinkQueryParam;
};
