import type {
  ConversationDeletedEntryViewModel,
  ConversationEntryViewModel,
  ConversationHistoryEntryViewModel,
  ConversationListItem,
} from './conversationTypes';

/**
 * 履歴に存在するが現存しない(=削除済みの)コメント/メッセージを、
 * 削除済み表示モデルへ変換する。最後の履歴行が DELETE でない id
 * (例: 履歴取得中で未確定)は対象から除く。
 */
export const toDeletedEntries = (
  historyByTargetId: ReadonlyMap<string, ConversationHistoryEntryViewModel[]>,
  liveIds: ReadonlySet<string>
): ConversationDeletedEntryViewModel[] => {
  const result: ConversationDeletedEntryViewModel[] = [];

  historyByTargetId.forEach((history, targetId) => {
    if (liveIds.has(targetId)) {
      return;
    }
    const last = history.at(-1);
    if (last === undefined || last.action !== 'DELETE') {
      return;
    }
    result.push({
      id: targetId,
      body: last.body,
      authorName: last.originalAuthorName,
      authorRole: last.originalAuthorRole,
      timestamp: last.originalTimestamp,
      deletedByName: last.operatedByName,
      deletedByRole: last.operatedByRole,
      deletedAt: last.operatedAt,
    });
  });

  return result;
};

/** 生存中の投稿と削除済み投稿を、元の投稿日時順に並べた 1 つの一覧にする。 */
export const mergeConversationListItems = (
  entries: ConversationEntryViewModel[],
  deletedEntries: ConversationDeletedEntryViewModel[]
): ConversationListItem[] =>
  [
    ...entries.map((entry): ConversationListItem => ({ kind: 'entry', entry })),
    ...deletedEntries.map(
      (entry): ConversationListItem => ({ kind: 'deleted', entry })
    ),
  ].sort((a, b) => a.entry.timestamp.localeCompare(b.entry.timestamp));
