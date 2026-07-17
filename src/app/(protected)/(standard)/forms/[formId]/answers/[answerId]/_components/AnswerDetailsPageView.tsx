import { Stack, Typography } from '@mui/material';

import Messages from '@/app/(protected)/_components/Conversation/Messages';
import type { ConversationDeepLinkProps } from '@/app/(protected)/_components/Conversation/useConversationEntryDeepLink';
import type {
  AnswerComment,
  GetAnswerResponse,
  GetFormResponse,
  GetMessagesResponse,
} from '@/lib/api-types';
import { resolveAnswerTitle } from '@/lib/forms/answerTitle';

import AnswerDetails from './AnswerDetails';
import AnswerMeta from './AnswerMeta';
import Comments from './Comments';

export type AnswerDetailsPageData = {
  answer: GetAnswerResponse;
  form: GetFormResponse;
  messages: GetMessagesResponse;
  comments: AnswerComment[];
  currentUserId: string | undefined;
  isAdmin: boolean;
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
}) => (
  <Stack
    direction="column"
    spacing={4}
    sx={{
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
    }}
  >
    <Typography
      variant="h4"
      component="h1"
      sx={!data.answer.title?.trim() ? { color: 'text.secondary' } : undefined}
    >
      {resolveAnswerTitle(data.answer.title)}
    </Typography>
    <AnswerMeta
      answer={data.answer}
      messageAction={
        <Messages
          messages={data.messages}
          formId={formId}
          answerId={answerId}
          title="メッセージ"
          triggerLabel={`メッセージ (${data.messages.length})`}
          isAdmin={data.isAdmin}
          deepLink={messageDeepLink}
        />
      }
    />
    <AnswerDetails answer={data.answer} questions={data.form.questions} />
    <Comments
      comments={data.comments}
      formId={data.answer.form_id}
      answerId={data.answer.id}
      currentUserId={data.currentUserId}
      showDeleteButton={undefined}
      isAdmin={data.isAdmin}
      deepLink={commentDeepLink}
    />
  </Stack>
);

export default AnswerDetailsPageView;
