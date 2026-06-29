import { Stack } from '@mui/material';
import Messages from '@/app/(protected)/_components/Messages';
import StandardAnswerDetails from '@/app/(protected)/(standard)/forms/[formId]/answers/[answerId]/_components/AnswerDetails';
import StandardAnswerMeta from '@/app/(protected)/(standard)/forms/[formId]/answers/[answerId]/_components/AnswerMeta';
import Comments from './Comments';
import {
  AdminAnswerLabelManagementButton,
  AdminAnswerLabels,
  AdminAnswerTitle,
} from './AnswerDetails';
import type {
  AnswerComment,
  GetAnswerLabelsResponse,
  GetAnswersResponse,
  GetFormResponse,
  GetMessagesResponse,
} from '@/lib/api-types';

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
}: {
  answerId: string;
  data: AdminAnswerPageData;
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
    />
  </Stack>
);

export default AdminAnswerPageView;
