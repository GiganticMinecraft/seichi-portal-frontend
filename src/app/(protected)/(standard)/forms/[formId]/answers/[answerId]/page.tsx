'use client';

import { Stack, Typography } from '@mui/material';
import { use } from 'react';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import ErrorDialog from '@/app/_components/ErrorDialog';
import LoadingCircular from '@/app/_components/LoadingCircular';
import Messages from '@/app/(protected)/_components/Messages';
import AnswerDetails from './_components/AnswerDetails';
import AnswerMeta from './_components/AnswerMeta';
import Comments from './_components/Comments';
import { usePageTitle } from '@/hooks/usePageTitle';

const Home = ({
  params,
}: {
  params: Promise<{ formId: string; answerId: string }>;
}) => {
  usePageTitle('回答詳細');
  const { formId, answerId } = use(params);
  const {
    data: answer,
    error: answerError,
    isLoading: isLoadingAnswers,
  } = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}',
    {
      path: { form_id: formId, answer_id: answerId },
    },
    { refreshInterval: 1000 }
  );

  const {
    data: form,
    error: formQuestionsError,
    isLoading: isLoadingFormQuestions,
  } = useApiQuery(
    '/api/v1/forms/{id}',
    {
      path: { id: answer?.form_id ?? '' },
    },
    { refreshInterval: 1000 }
  );

  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useApiQuery('/api/v1/users/me');

  const {
    data: messages,
    error: messagesError,
    isLoading: isLoadingMessages,
  } = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/messages',
    {
      path: { form_id: formId, answer_id: answerId },
    },
    { refreshInterval: 1000 }
  );

  const {
    data: comments,
    error: commentsError,
    isLoading: isLoadingComments,
  } = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/comments',
    {
      path: { form_id: formId, answer_id: answerId },
    },
    { refreshInterval: 1000 }
  );

  if (answerError || formQuestionsError || messagesError || commentsError) {
    return <ErrorDialog />;
  }

  if (
    isLoadingAnswers ||
    isLoadingFormQuestions ||
    isLoadingCurrentUser ||
    isLoadingMessages ||
    isLoadingComments ||
    !answer ||
    !form ||
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
      <Typography variant="h4">{answer.title}</Typography>
      <AnswerMeta
        answer={answer}
        messageAction={
          <Messages
            messages={messages}
            formId={formId}
            answerId={answerId}
            title="メッセージ"
            triggerLabel={`メッセージ (${messages.length})`}
          />
        }
      />
      <AnswerDetails answer={answer} questions={form.questions} />
      <Comments
        comments={comments}
        formId={answer.form_id}
        answerId={answer.id}
        currentUserId={currentUser?.id}
        showDeleteButton={undefined}
      />
    </Stack>
  );
};

export default Home;
