'use client';

import ConversationSurface from './ConversationSurface';
import type {
  ConversationCapabilities,
  ConversationEntryViewModel,
} from './conversationTypes';
import { useMessageConversationActions } from './useConversationActions';

type Message = {
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
  messages: Message[];
  formId: string;
  answerId: string;
}) => {
  const actions = useMessageConversationActions(props.formId, props.answerId);

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
    canCompose: false,
    composeLabel: 'メッセージを入力してください',
    composeHelperText: 'Shift + Enter で改行、Enter で送信することができます。',
    emptyMessage: 'メッセージはまだありません',
    adminLabel: '運営チーム',
    actionTrigger: 'menu',
  };

  return (
    <ConversationSurface
      variant="inline"
      entries={entries}
      capabilities={capabilities}
      onUpdate={actions.update}
      onDelete={actions.deleteEntry}
    />
  );
};

export default Messages;
