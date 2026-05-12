'use client';

import { Message } from '@mui/icons-material';
import ConversationSurface from './ConversationSurface';
import InputMessageField from './InputMessageField';
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
      {...(props.title ? { title: props.title } : {})}
      {...(props.triggerLabel ? { triggerLabel: props.triggerLabel } : {})}
      {...(variant === 'drawer' ? { triggerStartIcon: <Message /> } : {})}
      entries={entries}
      capabilities={capabilities}
      {...(capabilities.canCompose
        ? {
            composer: (
              <InputMessageField
                form_id={props.formId}
                answer_id={props.answerId}
                textFieldSx={{ mt: 1 }}
              />
            ),
          }
        : {})}
      onUpdate={actions.update}
      onDelete={actions.deleteEntry}
    />
  );
};

export default Messages;
