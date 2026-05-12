'use client';

import { Message as MessageIcon } from '@mui/icons-material';
import ConversationSurface from './ConversationSurface';
import InputMessageField from './InputMessageField';
import type {
  ConversationCapabilities,
  ConversationEntryViewModel,
} from './conversationTypes';
import { useMessageConversationActions } from './useConversationActions';

type ConversationMessage = {
  id: string;
  body: string;
  sender: {
    uuid: string;
    name: string;
    role: string;
  };
  timestamp: string;
};

const Messages = (props: {
  messages: ConversationMessage[];
  formId: string;
  answerId: string;
  variant?: 'drawer' | 'inline';
  title?: string;
  triggerLabel?: string;
}) => {
  const actions = useMessageConversationActions(props.formId, props.answerId);
  const variant = props.variant ?? 'inline';

  const entries: ConversationEntryViewModel[] = props.messages.map(
    (message) => ({
      id: message.id,
      body: message.body,
      authorName: message.sender.name,
      authorId: message.sender.uuid,
      authorRole: message.sender.role,
      timestamp: message.timestamp,
      renderMode: 'markdown',
      canDelete: true,
      canEdit: true,
    })
  );

  const capabilities: ConversationCapabilities = {
    canCompose: variant === 'drawer',
    composeLabel: 'メッセージを入力してください',
    composeHelperText: 'Shift + Enter で改行、Enter で送信することができます。',
    emptyMessage: 'メッセージはまだありません',
    adminLabel: '運営チーム',
    actionTrigger: 'menu',
  };

  return (
    <ConversationSurface
      variant={variant}
      title={props.title}
      triggerLabel={props.triggerLabel}
      triggerStartIcon={variant === 'drawer' ? <MessageIcon /> : undefined}
      entries={entries}
      capabilities={capabilities}
      composer={
        capabilities.canCompose ? (
          <InputMessageField
            form_id={props.formId}
            answer_id={props.answerId}
            textFieldSx={{ mt: 1 }}
          />
        ) : undefined
      }
      onUpdate={actions.update}
      onDelete={actions.deleteEntry}
    />
  );
};

export default Messages;
