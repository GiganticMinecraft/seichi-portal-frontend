'use client';

import { useCommentActions } from '@/hooks/useCommentActions';
import { useMessageActions } from '@/hooks/useMessageActions';
import { useSendMessage } from '@/hooks/useSendMessage';
import type { ConversationActionResult } from './conversationTypes';

/**
 * コメント API を、投稿一覧系 UI が扱う action interface へ寄せる adapter。
 */
export const useCommentConversationActions = (
  formId: string,
  answerId: string
) => {
  const { sendComment, deleteComment } = useCommentActions(formId, answerId);

  return {
    send: async (body: string): Promise<ConversationActionResult> => {
      const result = await sendComment(body);
      return {
        success: result.ok,
        ...(result.forbidden ? { forbidden: true } : {}),
      };
    },
    deleteEntry: async (entryId: string): Promise<ConversationActionResult> => {
      const result = await deleteComment(entryId);
      return {
        success: result.ok,
        ...(result.forbidden ? { forbidden: true } : {}),
      };
    },
  };
};

/**
 * メッセージ API を、投稿一覧系 UI が扱う action interface へ寄せる adapter。
 */
export const useMessageConversationActions = (
  formId: string,
  answerId: string
) => {
  const { sendMessage } = useSendMessage(formId, answerId);
  const { updateMessage, deleteMessage } = useMessageActions(formId, answerId);

  return {
    send: (body: string) => sendMessage(body),
    update: (entryId: string, body: string) => updateMessage(entryId, body),
    deleteEntry: (entryId: string) => deleteMessage(entryId),
  };
};
