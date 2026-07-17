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
  /**
   * Paper の視覚スタイル。本文 (body) は常に Markdown として解釈する設計判断であり、
   * plain 解釈が必要になった場合は再検討すること。
   */
  surface: 'bubble' | 'flat';
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
  deepLinkQueryParam: ConversationDeepLinkQueryParam;
  /** エラーメッセージ等で使う、投稿を指す名詞(例: 'メッセージ' / 'コメント')。 */
  entryNoun: string;
};
