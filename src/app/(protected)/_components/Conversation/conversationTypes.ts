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
  /**
   * 編集履歴(古い順、初回投稿を含む)。undefined は履歴未取得、空配列は
   * 履歴取得済みで編集なし(初回投稿のみ)を表す。
   */
  editHistory?: ConversationHistoryEntryViewModel[];
};

/** 投稿一覧の直リンクに使う URL クエリパラメータ名。 */
export type ConversationDeepLinkQueryParam = 'messageId' | 'commentId';

export type ConversationHistoryAction = 'CREATE' | 'UPDATE' | 'DELETE';

/** コメント・メッセージの変更履歴 UI が受け取る共通表示モデル。 */
export type ConversationHistoryEntryViewModel = {
  /** 履歴行自体の id。 */
  id: string;
  /** この履歴が紐づくコメント/メッセージの id。 */
  targetId: string;
  action: ConversationHistoryAction;
  body: string;
  operatedByName: string;
  operatedByRole: string;
  operatedAt: string;
  originalAuthorName: string;
  originalAuthorRole: string;
  originalTimestamp: string;
};

/** 管理者にのみ表示する、削除済みコメント/メッセージの表示モデル。 */
export type ConversationDeletedEntryViewModel = {
  id: string;
  body: string;
  authorName: string;
  authorRole: string;
  /** 元の投稿日時。会話一覧内での表示位置の並び替えに使う。 */
  timestamp: string;
  deletedByName: string;
  deletedByRole: string;
  deletedAt: string;
};

/** 会話一覧に並べる 1 行。生存中の投稿と削除済み投稿を同じ並びで扱うための discriminated union。 */
export type ConversationListItem =
  | { kind: 'entry'; entry: ConversationEntryViewModel }
  | { kind: 'deleted'; entry: ConversationDeletedEntryViewModel };

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
