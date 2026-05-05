'use client';

import { Stack, Typography } from '@mui/material';
import { use } from 'react';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import AnswerDetails from './_components/AnswerDetails';
import AnswerMeta from './_components/AnswerMeta';
import Comments from './_components/Comments';
import type { AnswerCommentType } from '@/lib/api-types';

const Home = ({
  params,
}: {
  params: Promise<{ formId: string; answerId: string }>;
}) => {
  const { formId, answerId } = use(params);
  const {
    data: answer,
    error: answerError,
    isLoading: isLoadingAnswers,
  } = useApiQuery(
    '/forms/{form_id}/answers/{answer_id}',
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
    '/forms/{id}',
    {
      path: { id: answer?.form_id ?? '' },
    },
    { refreshInterval: 1000 }
  );

  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useApiQuery('/users/me');

  if (answerError || formQuestionsError) {
    return <ErrorModal />;
  }

  if (
    isLoadingAnswers ||
    isLoadingFormQuestions ||
    isLoadingCurrentUser ||
    !answer ||
    !form
  ) {
    return <LoadingCircular />;
  }

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="space-between"
      spacing={4}
      sx={{ width: '100%' }}
    >
      <Typography variant="h4">{answer.title}</Typography>
      <AnswerMeta answer={answer} />
      <AnswerDetails answer={answer} questions={form.questions} />
      <Comments
        comments={answer.comments as AnswerCommentType[]}
        formId={answer.form_id}
        answerId={answer.id}
        currentUserId={currentUser?.id}
        showDeleteButton={undefined}
      />
    </Stack>
  );
};

export default Home;
