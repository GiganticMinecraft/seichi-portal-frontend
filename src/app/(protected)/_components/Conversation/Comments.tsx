'use client';

import { Box, Typography } from '@mui/material';

import type { AnswerComment } from '@/lib/api-types';

import ConversationComposer from './ConversationComposer';
import {
  mergeConversationListItems,
  toDeletedEntries,
} from './conversationListItems';
import ConversationSurface from './ConversationSurface';
import type {
  ConversationCapabilities,
  ConversationEntryViewModel,
} from './conversationTypes';
import { useCommentConversationActions } from './useConversationActions';
import type { ConversationDeepLinkProps } from './useConversationEntryDeepLink';
import {
  ConversationDeepLinkNotice,
  useConversationEntryDeepLink,
} from './useConversationEntryDeepLink';
import { useCommentHistory } from './useConversationHistory';

const Comments = (props: {
  comments: AnswerComment[];
  formId: string;
  answerId: string;
  currentUserId: string | undefined;
  showDeleteButton: boolean | undefined;
  isAdmin: boolean;
  deepLink: ConversationDeepLinkProps;
  /** true のとき、コメントの閲覧・投稿を無効化する(バックエンドへのリクエストも行わない)。 */
  disabled?: boolean | undefined;
  /** disabled が true のときに trigger ボタンのホバーで表示する理由。 */
  disabledReason?: string | undefined;
}) => {
  const actions = useCommentConversationActions(props.formId, props.answerId);
  const { historyByTargetId, isLoading: isHistoryLoading } = useCommentHistory(
    props.formId,
    props.answerId,
    !props.disabled
  );

  const entries: ConversationEntryViewModel[] = props.comments.map(
    (comment) => {
      const editHistory = isHistoryLoading
        ? undefined
        : historyByTargetId.get(comment.id);

      return {
        id: comment.id,
        body: comment.content,
        authorName: comment.commented_by.name,
        authorId: comment.commented_by.uuid,
        authorRole: comment.commented_by.role,
        timestamp: comment.timestamp,
        surface: 'bubble',
        canDelete:
          (props.showDeleteButton ?? false) ||
          (props.currentUserId !== undefined &&
            comment.commented_by.uuid === props.currentUserId),
        canEdit:
          props.currentUserId !== undefined &&
          comment.commented_by.uuid === props.currentUserId,
        ...(editHistory !== undefined ? { editHistory } : {}),
      };
    }
  );

  const deletedEntries = props.isAdmin
    ? toDeletedEntries(
        historyByTargetId,
        new Set(props.comments.map((comment) => comment.id))
      )
    : [];

  const items = mergeConversationListItems(entries, deletedEntries);

  const capabilities: ConversationCapabilities = {
    canCompose: true,
    composeLabel: 'コメントを入力...',
    composeHelperText: 'Markdown に対応しています。',
    emptyMessage: 'コメントはまだありません',
    deepLinkQueryParam: 'commentId',
    entryNoun: 'コメント',
  };

  const deepLinkState = useConversationEntryDeepLink(
    props.deepLink,
    entries,
    'コメント'
  );

  return (
    <Box>
      <ConversationDeepLinkNotice
        message={deepLinkState.notFoundMessage}
        onClose={deepLinkState.dismissNotFoundMessage}
      />
      <ConversationSurface
        variant="drawer"
        title="コメント"
        triggerLabel={`コメント (${entries.length})`}
        triggerStartIcon={<Typography component="span">💬</Typography>}
        triggerDescription="回答について議論したり、メモを残したりするための機能です。基本的に、この回答を閲覧できる人であれば誰でも閲覧できます。"
        triggerDisabled={props.disabled}
        triggerDisabledReason={props.disabledReason}
        items={items}
        capabilities={capabilities}
        autoOpen={deepLinkState.autoOpen}
        highlightedEntryId={deepLinkState.highlightedEntryId}
        onDrawerClose={deepLinkState.onDrawerClose}
        inputForm={
          props.disabled ? null : capabilities.canCompose ? (
            <Box
              sx={{
                p: 2,
                borderTop: 1,
                borderColor: 'divider',
                backgroundColor: 'background.paper',
              }}
            >
              <ConversationComposer
                label={capabilities.composeLabel}
                helperText={capabilities.composeHelperText}
                onSend={actions.send}
              />
            </Box>
          ) : null
        }
        onUpdate={actions.update}
        onDelete={actions.deleteEntry}
      />
    </Box>
  );
};

export default Comments;
