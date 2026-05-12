'use client';

import { Stack } from '@mui/material';
import { use } from 'react';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import Messages from '@/app/(authed)/_components/Messages';
import AnswerDetails from './_components/AnswerDetails';
import Comments from './_components/Comments';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { AnswerCommentType } from '@/lib/api-types';

const Home = ({ params }: { params: Promise<{ answerId: string }> }) => {
  usePageTitle('回答管理');
  const { answerId } = use(params);
  const {
    data: allAnswers,
    error: answersError,
    isLoading: isAnswersLoading,
  } = useApiQuery('/forms/answers', undefined, { refreshInterval: 1000 });

  const answers = allAnswers?.find((a) => a.id === answerId);

  const {
    data: form,
    error: formQuestionsError,
    isLoading: isFormQuestionsLoading,
  } = useApiQuery(
    '/forms/{id}',
    {
      path: { id: answers?.form_id ?? '' },
    },
    { refreshInterval: 1000 }
  );

  const {
    data: labels,
    error: labelsError,
    isLoading: isLabelsLoading,
  } = useApiQuery('/labels/answers');

  const {
    data: messages,
    error: messagesError,
    isLoading: isMessagesLoading,
  } = useApiQuery(
    '/forms/{form_id}/answers/{answer_id}/messages',
    {
      path: {
        form_id: answers?.form_id ?? '',
        answer_id: answerId,
      },
    },
    { refreshInterval: 1000 }
  );

  if (answersError || formQuestionsError || labelsError || messagesError) {
    return <ErrorModal />;
  }

  if (
    isAnswersLoading ||
    isFormQuestionsLoading ||
    isLabelsLoading ||
    isMessagesLoading ||
    !answers ||
    !form ||
    !labels ||
    !messages
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
      <AnswerDetails
        answers={answers}
        questions={form.questions}
        labels={labels}
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
      <Comments
        comments={answers.comments as AnswerCommentType[]}
        formId={answers.form_id}
        answerId={answerId}
        currentUserId={undefined}
        showDeleteButton
      />
    </Stack>
  );
};

export default Home;
