'use client';

import { Stack } from '@mui/material';
import { use } from 'react';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import ErrorDialog from '@/app/_components/ErrorDialog';
import LoadingCircular from '@/app/_components/LoadingCircular';
import Messages from '@/app/(protected)/_components/Messages';
import StandardAnswerDetails from '@/app/(protected)/(standard)/forms/[formId]/answers/[answerId]/_components/AnswerDetails';
import StandardAnswerMeta from '@/app/(protected)/(standard)/forms/[formId]/answers/[answerId]/_components/AnswerMeta';
import Comments from './_components/Comments';
import {
  AdminAnswerLabelManagementButton,
  AdminAnswerLabels,
  AdminAnswerTitle,
} from './_components/AnswerDetails';
import { toAdminAnswerPageState } from './adminAnswerPageState';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { AdminAnswerPageData } from './adminAnswerPageState';

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

const Home = ({ params }: { params: Promise<{ answerId: string }> }) => {
  usePageTitle('回答管理');
  const { answerId } = use(params);
  const allAnswersQuery = useApiQuery('/api/v1/forms/answers', undefined, {
    refreshInterval: 1000,
  });

  const { data: allAnswers } = allAnswersQuery;
  const answers = allAnswers?.find((a) => a.id === answerId);

  const formQuery = useApiQuery(
    '/api/v1/forms/{id}',
    {
      path: { id: answers?.form_id ?? '' },
    },
    { refreshInterval: 1000 }
  );

  const labelsQuery = useApiQuery('/api/v1/labels/answers');

  const messagesQuery = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/messages',
    {
      path: {
        form_id: answers?.form_id ?? '',
        answer_id: answerId,
      },
    },
    { refreshInterval: 1000 }
  );

  const commentsQuery = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/comments',
    {
      path: {
        form_id: answers?.form_id ?? '',
        answer_id: answerId,
      },
    },
    { refreshInterval: 1000 }
  );

  const pageState = toAdminAnswerPageState({
    answerId,
    allAnswers: allAnswersQuery,
    form: formQuery,
    labels: labelsQuery,
    messages: messagesQuery,
    comments: commentsQuery,
  });

  if (pageState.kind === 'error') {
    return <ErrorDialog />;
  }

  if (pageState.kind === 'notFound') {
    return (
      <ErrorDialog
        status={404}
        title="回答が見つかりません"
        message="指定された回答は存在しないか、表示できません。"
      />
    );
  }

  if (pageState.kind !== 'ready') {
    return <LoadingCircular />;
  }

  return <AdminAnswerPageView answerId={answerId} data={pageState.data} />;
};

export default Home;
