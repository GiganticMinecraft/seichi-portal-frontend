'use client';

import { CssBaseline, Stack, ThemeProvider } from '@mui/material';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import AnswerDetails from './_components/AnswerDetails';
import Comments from './_components/Comments';
import adminDashboardTheme from '../../theme/adminDashboardTheme';
import type {
  ErrorResponse,
  GetAnswerResponse,
  GetQuestionsResponse,
} from '@/app/api/_schemas/ResponseSchemas';
import type { Either } from 'fp-ts/lib/Either';

const Home = ({ params }: { params: { answerId: number } }) => {
  const { data: answers, isLoading: isAnswersLoading } = useSWR<
    Either<ErrorResponse, GetAnswerResponse>
  >(`/api/answers/${params.answerId}`, { refreshInterval: 1000 });

  const { data: formQuestions, isLoading: isFormQuestionsLoading } = useSWR<
    Either<ErrorResponse, GetQuestionsResponse>
  >(
    answers && answers._tag === 'Right'
      ? `/api/questions?formId=${answers.right.form_id}`
      : ''
  );

  if (!answers || !formQuestions) {
    return <LoadingCircular />;
  } else if (
    (!isAnswersLoading && !answers) ||
    (!isFormQuestionsLoading && !formQuestions) ||
    answers._tag === 'Left' ||
    formQuestions._tag === 'Left'
  ) {
    return <ErrorModal />;
  }

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <Stack spacing={2}>
        <AnswerDetails
          answers={answers.right}
          questions={formQuestions.right}
        />
        <Comments
          comments={answers.right.comments}
          answerId={params.answerId}
        />
      </Stack>
    </ThemeProvider>
  );
};

export default Home;
