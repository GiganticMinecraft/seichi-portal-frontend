'use client';

import { Stack, Typography } from '@mui/material';
import { redirect } from 'next/navigation';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import AnswerDetails from './_components/AnswerDetails';
import AnswerMeta from './_components/AnswerMeta';
import Comments from './_components/Comments';
import type {
  ErrorResponse,
  GetAnswerResponse,
  GetQuestionsResponse,
} from '@/app/api/_schemas/ResponseSchemas';
import type { Either } from 'fp-ts/lib/Either';

const Home = ({ params }: { params: { formId: number; answerId: number } }) => {
  const { data: answer, isLoading: isLoadingAnswers } = useSWR<
    Either<ErrorResponse, GetAnswerResponse>
  >(`/api/answers/${params.answerId}`, { refreshInterval: 1000 });

  const { data: formQuestions, isLoading: isLoadingFormQuestions } = useSWR<
    Either<ErrorResponse, GetQuestionsResponse>
  >(
    answer && answer._tag === 'Right'
      ? `/api/questions?formId=${answer.right.form_id}`
      : ''
  );

  if (
    answer?._tag === 'Left' &&
    answer.left.errorCode === 'DO_NOT_HAVE_PERMISSION_TO_GET_ANSWER'
  ) {
    return redirect('/forbidden');
  } else if (!answer || !formQuestions) {
    return <LoadingCircular />;
  } else if (
    (!isLoadingAnswers && !answer) ||
    answer._tag === 'Left' ||
    (!isLoadingFormQuestions && !formQuestions) ||
    formQuestions._tag === 'Left'
  ) {
    return <ErrorModal />;
  }

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="space-between"
      spacing={4}
      sx={{ width: '100%' }}
    >
      <Typography variant="h4">{answer.right.title}</Typography>
      <AnswerMeta answer={answer.right} />
      <AnswerDetails answer={answer.right} questions={formQuestions.right} />
      <Comments comments={answer.right.comments} answerId={answer.right.id} />
    </Stack>
  );
};

export default Home;
