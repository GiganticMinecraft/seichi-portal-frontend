'use client';

import { Box, Typography } from '@mui/material';
import type { AnswerCommentType } from '@/lib/api-types';
import ConversationComposer from './ConversationComposer';
import ConversationSurface from './ConversationSurface';
import type {
  ConversationCapabilities,
  ConversationEntryViewModel,
} from './conversationTypes';
import { useCommentConversationActions } from './useConversationActions';

const Comments = (props: {
  comments: AnswerCommentType[];
  formId: string;
  answerId: string;
  currentUserId: string | undefined;
  showDeleteButton: boolean | undefined;
}) => {
  const actions = useCommentConversationActions(props.formId, props.answerId);

  const entries: ConversationEntryViewModel[] = props.comments.map(
    (comment) => ({
      id:
        comment.comment_id ??
        `${comment.commented_by.name}-${comment.timestamp}`,
      body: comment.content,
      authorName: comment.commented_by.name,
      authorId: comment.commented_by.uuid,
      authorRole: comment.commented_by.role,
      timestamp: comment.timestamp,
      renderMode: 'plain',
      canDelete:
        (props.showDeleteButton ?? false) ||
        (props.currentUserId !== undefined &&
          comment.commented_by.uuid === props.currentUserId),
      canEdit: false,
    })
  );

  const capabilities: ConversationCapabilities = {
    canCompose: true,
    composeLabel: 'コメントを入力...',
    composeHelperText: '',
    emptyMessage: 'コメントはまだありません',
    adminLabel: '運営',
    actionTrigger: 'icon',
  };

  return (
    <Box>
      <ConversationSurface
        variant="drawer"
        title="コメント"
        triggerLabel={`コメント (${entries.length})`}
        triggerStartIcon={<Typography component="span">💬</Typography>}
        entries={entries}
        capabilities={capabilities}
        inputForm={
          capabilities.canCompose ? (
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
        onDelete={actions.deleteEntry}
      />
    </Box>
  );
};

export default Comments;
