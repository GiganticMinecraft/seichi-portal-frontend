'use client';

import { Message as MessageIcon } from '@mui/icons-material';

import {
  mergeConversationListItems,
  toDeletedEntries,
} from './conversationListItems';
import ConversationSurface from './ConversationSurface';
import type {
  ConversationCapabilities,
  ConversationEntryViewModel,
} from './conversationTypes';
import InputMessageField from './InputMessageField';
import { useMessageConversationActions } from './useConversationActions';
import type { ConversationDeepLinkProps } from './useConversationEntryDeepLink';
import {
  ConversationDeepLinkNotice,
  useConversationEntryDeepLink,
} from './useConversationEntryDeepLink';
import { useMessageHistory } from './useConversationHistory';

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
  title: string;
  triggerLabel: string;
  isAdmin: boolean;
  deepLink: ConversationDeepLinkProps;
}) => {
  const actions = useMessageConversationActions(props.formId, props.answerId);
  const { historyByTargetId, isLoading: isHistoryLoading } = useMessageHistory(
    props.formId,
    props.answerId
  );

  const entries: ConversationEntryViewModel[] = props.messages.map(
    (message) => {
      const editHistory = isHistoryLoading
        ? undefined
        : historyByTargetId.get(message.id);

      return {
        id: message.id,
        body: message.body,
        authorName: message.sender.name,
        authorId: message.sender.uuid,
        authorRole: message.sender.role,
        timestamp: message.timestamp,
        surface: 'flat',
        canDelete: true,
        canEdit: true,
        ...(editHistory !== undefined ? { editHistory } : {}),
      };
    }
  );

  const deletedEntries = props.isAdmin
    ? toDeletedEntries(
        historyByTargetId,
        new Set(props.messages.map((message) => message.id))
      )
    : [];

  const items = mergeConversationListItems(entries, deletedEntries);

  const capabilities: ConversationCapabilities = {
    canCompose: true,
    composeLabel: 'メッセージを入力してください',
    composeHelperText: 'Shift + Enter で改行、Enter で送信することができます。',
    emptyMessage: 'メッセージはまだありません',
    deepLinkQueryParam: 'messageId',
    entryNoun: 'メッセージ',
  };

  const deepLinkState = useConversationEntryDeepLink(
    props.deepLink,
    entries,
    'メッセージ'
  );

  return (
    <>
      <ConversationDeepLinkNotice
        message={deepLinkState.notFoundMessage}
        onClose={deepLinkState.dismissNotFoundMessage}
      />
      <ConversationSurface
        variant="drawer"
        title={props.title}
        triggerLabel={props.triggerLabel}
        triggerStartIcon={<MessageIcon />}
        items={items}
        capabilities={capabilities}
        autoOpen={deepLinkState.autoOpen}
        highlightedEntryId={deepLinkState.highlightedEntryId}
        onDrawerClose={deepLinkState.onDrawerClose}
        inputForm={
          <InputMessageField
            form_id={props.formId}
            answer_id={props.answerId}
            textFieldSx={{ mt: 1 }}
          />
        }
        onUpdate={actions.update}
        onDelete={actions.deleteEntry}
      />
    </>
  );
};

export default Messages;
