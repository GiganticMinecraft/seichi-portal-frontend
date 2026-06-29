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
import { usePageTitle } from '@/hooks/usePageTitle';


const Home = ({ params }: { params: Promise<{ answerId: string }> }) => {
  usePageTitle('回答管理');
  const { answerId } = use(params);
  const {
    data: allAnswers,
    error: answersError,
    isLoading: isAnswersLoading,
  } = useApiQuery('/api/v1/forms/answers', undefined, {
    refreshInterval: 1000,
  });

  const answers = allAnswers?.find((a) => a.id === answerId);

  const {
    data: form,
    error: formQuestionsError,
    isLoading: isFormQuestionsLoading,
  } = useApiQuery(
    '/api/v1/forms/{id}',
    {
      path: { id: answers?.form_id ?? '' },
    },
    { refreshInterval: 1000 }
  );

  const {
    data: labels,
    error: labelsError,
    isLoading: isLabelsLoading,
  } = useApiQuery('/api/v1/labels/answers');

  const {
    data: messages,
    error: messagesError,
    isLoading: isMessagesLoading,
  } = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/messages',
    {
      path: {
        form_id: answers?.form_id ?? '',
        answer_id: answerId,
      },
    },
    { refreshInterval: 1000 }
  );

  const {
    data: comments,
    error: commentsError,
    isLoading: isCommentsLoading,
  } = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/comments',
    {
      path: {
        form_id: answers?.form_id ?? '',
        answer_id: answerId,
      },
    },
    { refreshInterval: 1000 }
  );

  if (
    answersError ||
    formQuestionsError ||
    labelsError ||
    messagesError ||
    commentsError
  ) {
    return <ErrorDialog />;
  }

  if (
    isAnswersLoading ||
    isFormQuestionsLoading ||
    isLabelsLoading ||
    isMessagesLoading ||
    isCommentsLoading ||
    !answers ||
    !form ||
    !labels ||
    !messages ||
    !comments
  ) {
    return <LoadingCircular />;
  }

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
      <AdminAnswerTitle answer={answers} />
      <StandardAnswerMeta
        answer={answers}
        labelsSlot={
          <AdminAnswerLabels labelOptions={labels} answer={answers} />
        }
        extraActions={<AdminAnswerLabelManagementButton />}
        messageAction={
          <Messages
            messages={messages}
            formId={answers.form_id}
            answerId={answerId}
            title="メッセージ"
            triggerLabel={`回答者にメッセージを送信 (${messages.length})`}
          />
        }
      />
      <StandardAnswerDetails answer={answers} questions={form.questions} />
      <Comments
        comments={comments}
        formId={answers.form_id}
        answerId={answerId}
        currentUserId={undefined}
        showDeleteButton
      />
    </Stack>
  );
};

export default Home;
