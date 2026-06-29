'use client';

import { Stack, Typography } from '@mui/material';
import { use } from 'react';
import {
  getOptionalQueryData,
  getRequiredQueryGroupError,
  isQueryGroupReady,
} from '@/app/_swr/queryState';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import ErrorDialog from '@/app/_components/ErrorDialog';
import LoadingCircular from '@/app/_components/LoadingCircular';
import Messages from '@/app/(protected)/_components/Messages';
import AnswerDetails from './_components/AnswerDetails';
import AnswerMeta from './_components/AnswerMeta';
import Comments from './_components/Comments';
import { usePageTitle } from '@/hooks/usePageTitle';
import type {
  AnswerComment,
  GetAnswerResponse,
  GetFormResponse,
  GetMessagesResponse,
} from '@/lib/api-types';

type AnswerDetailsPageData = {
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

const Home = ({
  params,
}: {
  params: Promise<{ formId: string; answerId: string }>;
}) => {
  usePageTitle('回答詳細');
  const { formId, answerId } = use(params);
  const answerQuery = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}',
    {
      path: { form_id: formId, answer_id: answerId },
    },
    { refreshInterval: 1000 }
  );

  const { data: answer } = answerQuery;

  const formQuery = useApiQuery(
    '/api/v1/forms/{id}',
    {
      path: { id: answer?.form_id ?? '' },
    },
    { refreshInterval: 1000 }
  );

  const currentUserQuery = useApiQuery('/api/v1/users/me');

  const messagesQuery = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/messages',
    {
      path: { form_id: formId, answer_id: answerId },
    },
    { refreshInterval: 1000 }
  );

  const commentsQuery = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/comments',
    {
      path: { form_id: formId, answer_id: answerId },
    },
    { refreshInterval: 1000 }
  );

  const requiredQueries = {
    answer: answerQuery,
    form: formQuery,
    messages: messagesQuery,
    comments: commentsQuery,
  };
  const queryError = getRequiredQueryGroupError(requiredQueries);

  if (queryError !== undefined) {
    return <ErrorDialog />;
  }

  if (!isQueryGroupReady(requiredQueries)) {
    return <LoadingCircular />;
  }

  const currentUser = getOptionalQueryData(currentUserQuery);
  const data: AnswerDetailsPageData = {
    answer: requiredQueries.answer.data,
    form: requiredQueries.form.data,
    messages: requiredQueries.messages.data,
    comments: requiredQueries.comments.data,
    currentUserId: currentUser?.id,
  };

  return (
    <AnswerDetailsPageView formId={formId} answerId={answerId} data={data} />
  );
};

export default Home;
