import { Stack } from '@mui/material';

import StandardAnswerDetails from '@/app/(protected)/(standard)/forms/[formId]/answers/[answerId]/_components/AnswerDetails';
import StandardAnswerMeta from '@/app/(protected)/(standard)/forms/[formId]/answers/[answerId]/_components/AnswerMeta';
import Messages from '@/app/(protected)/_components/Messages';
import type { ConversationDeepLinkProps } from '@/app/(protected)/_components/useConversationEntryDeepLink';
import type {
  AnswerComment,
  GetAnswerLabelsResponse,
  GetAnswersResponse,
  GetFormResponse,
  GetMessagesResponse,
} from '@/lib/api-types';

import {
  AdminAnswerLabelManagementButton,
  AdminAnswerLabels,
  AdminAnswerTitle,
} from './AnswerDetails';
import Comments from './Comments';

type AdminAnswer = GetAnswersResponse[number];

export type AdminAnswerPageData = {
  answer: AdminAnswer;
  form: GetFormResponse;
  labels: GetAnswerLabelsResponse;
  messages: GetMessagesResponse;
  comments: AnswerComment[];
};

const AdminAnswerPageView = ({
  answerId,
  data,
  messageDeepLink,
  commentDeepLink,
}: {
  answerId: string;
  data: AdminAnswerPageData;
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
    <AdminAnswerTitle answer={data.answer} />
    <StandardAnswerMeta
      answer={data.answer}
      labelsSlot={
        <AdminAnswerLabels labelOptions={data.labels} answer={data.answer} />
      }
      extraActions={<AdminAnswerLabelManagementButton />}
      messageAction={
        <Messages
          messages={data.messages}
          formId={data.answer.form_id}
          answerId={answerId}
          title="メッセージ"
          triggerLabel={`回答者にメッセージを送信 (${data.messages.length})`}
          deepLink={messageDeepLink}
        />
      }
    />
    <StandardAnswerDetails
      answer={data.answer}
      questions={data.form.questions}
    />
    <Comments
      comments={data.comments}
      formId={data.answer.form_id}
      answerId={answerId}
      currentUserId={undefined}
      showDeleteButton
      deepLink={commentDeepLink}
    />
  </Stack>
);

export default AdminAnswerPageView;
