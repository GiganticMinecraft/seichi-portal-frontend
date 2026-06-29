import { Stack, Typography } from '@mui/material';

import Messages from '@/app/(protected)/_components/Messages';
import type {
  AnswerComment,
  GetAnswerResponse,
  GetFormResponse,
  GetMessagesResponse,
} from '@/lib/api-types';

import AnswerDetails from './AnswerDetails';
import AnswerMeta from './AnswerMeta';
import Comments from './Comments';

export type AnswerDetailsPageData = {
  answer: GetAnswerResponse;
  form: GetFormResponse;
  messages: GetMessagesResponse;
  comments: AnswerComment[];
  currentUserId: string | undefined;
};

const AnswerDetailsPageView = ({
  formId,
  answerId,
  data,
}: {
  formId: string;
  answerId: string;
  data: AnswerDetailsPageData;
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
    <Typography variant="h4">{data.answer.title}</Typography>
    <AnswerMeta
      answer={data.answer}
      messageAction={
        <Messages
          messages={data.messages}
          formId={formId}
          answerId={answerId}
          title="メッセージ"
          triggerLabel={`メッセージ (${data.messages.length})`}
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
    />
  </Stack>
);

export default AnswerDetailsPageView;
