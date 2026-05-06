'use client';

import { Stack } from '@mui/material';
import { use } from 'react';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import AnswerDetails from './_components/AnswerDetails';
import Comments from './_components/Comments';
import type { AnswerCommentType } from '@/lib/api-types';

const Home = ({ params }: { params: Promise<{ answerId: string }> }) => {
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

  if (answersError || formQuestionsError || labelsError) {
    return <ErrorModal />;
  }

  if (
    isAnswersLoading ||
    isFormQuestionsLoading ||
    isLabelsLoading ||
    !answers ||
    !form ||
    !labels
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
        alignItems: 'space-between',
      }}
    >
      <AnswerDetails
        answers={answers}
        questions={form.questions}
        labels={labels}
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
