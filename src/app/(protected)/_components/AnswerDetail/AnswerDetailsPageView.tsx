import { Stack, Typography } from '@mui/material';

import Comments from '@/app/(protected)/_components/Conversation/Comments';
import Messages from '@/app/(protected)/_components/Conversation/Messages';
import type { ConversationDeepLinkProps } from '@/app/(protected)/_components/Conversation/useConversationEntryDeepLink';
import type {
  AnswerComment,
  GetAnswerLabelsResponse,
  GetAnswerResponse,
  GetFormResponse,
  GetMessagesResponse,
} from '@/lib/api-types';
import { resolveAnswerTitle } from '@/lib/forms/answerTitle';

import {
  AdminAnswerLabelManagementButton,
  AdminAnswerLabels,
  AdminAnswerPublicationToggle,
  AdminAnswerTitle,
} from './AnswerAdminControls';
import AnswerDetails from './AnswerDetails';
import AnswerMeta from './AnswerMeta';

export type AnswerDetailsPageData = {
  answer: GetAnswerResponse;
  form: GetFormResponse;
  messages: GetMessagesResponse;
  comments: AnswerComment[];
  commentsDisabled: boolean;
  currentUserId: string;
  isAdmin: boolean;
  labelOptions: GetAnswerLabelsResponse;
};

const AnswerDetailsPageView = ({
  formId,
  answerId,
  data,
  messageDeepLink,
  commentDeepLink,
}: {
  formId: string;
  answerId: string;
  data: AnswerDetailsPageData;
  messageDeepLink: ConversationDeepLinkProps;
  commentDeepLink: ConversationDeepLinkProps;
}) => {
  const { author } = data.answer;
  const isAuthenticatedAuthor = author.type === 'AUTHENTICATED_USER';
  const isAuthor =
    author.type === 'AUTHENTICATED_USER' &&
    author.user.uuid === data.currentUserId;
  const canAccessMessages = data.isAdmin || isAuthor;
  const messagesDisabled = !isAuthenticatedAuthor || !canAccessMessages;
  const messagesDisabledReason = !isAuthenticatedAuthor
    ? '未ログインユーザーの回答のため、メッセージを送信できません'
    : 'この回答の管理者または投稿者本人のみメッセージを閲覧できます';

  return (
    <Stack
      direction="column"
      spacing={4}
      sx={{
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
      }}
    >
      {data.isAdmin ? (
        <AdminAnswerTitle answer={data.answer} />
      ) : (
        <Typography
          variant="h4"
          component="h1"
          sx={
            !data.answer.title?.trim() ? { color: 'text.secondary' } : undefined
          }
        >
          {resolveAnswerTitle(data.answer.title)}
        </Typography>
      )}
      <AnswerMeta
        answer={data.answer}
        labelsSlot={
          data.isAdmin ? (
            <AdminAnswerLabels
              labelOptions={data.labelOptions}
              answer={data.answer}
            />
          ) : undefined
        }
        publicationSlot={
          data.isAdmin ? (
            <AdminAnswerPublicationToggle answer={data.answer} />
          ) : undefined
        }
        extraActions={
          data.isAdmin ? <AdminAnswerLabelManagementButton /> : undefined
        }
        messageAction={
          <Messages
            messages={data.messages}
            formId={formId}
            answerId={answerId}
            title="メッセージ"
            triggerLabel={
              data.isAdmin
                ? `回答者にメッセージを送信 (${data.messages.length})`
                : `メッセージ (${data.messages.length})`
            }
            isAdmin={data.isAdmin}
            deepLink={messageDeepLink}
            disabled={messagesDisabled}
            disabledReason={messagesDisabledReason}
          />
        }
      />
      <AnswerDetails answer={data.answer} questions={data.form.questions} />
      <Comments
        comments={data.comments}
        formId={formId}
        answerId={answerId}
        currentUserId={data.currentUserId}
        showDeleteButton={data.isAdmin ? true : undefined}
        isAdmin={data.isAdmin}
        deepLink={commentDeepLink}
        disabled={data.commentsDisabled}
        disabledReason={
          data.commentsDisabled
            ? 'この回答が非公開のため、管理者以外はコメントを閲覧できません'
            : undefined
        }
      />
    </Stack>
  );
};

export default AnswerDetailsPageView;
