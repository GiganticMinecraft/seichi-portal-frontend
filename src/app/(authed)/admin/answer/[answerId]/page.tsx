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
  GetAnswerLabelsResponse,
  GetAnswerResponse,
  GetQuestionsResponse,
} from '@/app/api/_schemas/ResponseSchemas';
import type { Either } from 'fp-ts/lib/Either';

const Home = ({ params }: { params: { answerId: number } }) => {
  const { data: answers, isLoading: isAnswersLoading } = useSWR<
    Either<ErrorResponse, GetAnswerResponse>
  >(`/api/proxy/forms/answers/${params.answerId}`, { refreshInterval: 1000 });

  const { data: formQuestions, isLoading: isFormQuestionsLoading } = useSWR<
    Either<ErrorResponse, GetQuestionsResponse>
  >(
    answers && answers._tag === 'Right'
      ? `/api/proxy/forms/${answers.right.form_id}/questions`
      : ''
  );

  const { data: labels, isLoading: isLabelsLoading } = useSWR<
    Either<ErrorResponse, GetAnswerLabelsResponse>
  >('/api/proxy/forms/labels/answers');

  if (!answers || !formQuestions || !labels) {
    return <LoadingCircular />;
  } else if (
    (!isAnswersLoading && !answers) ||
    (!isFormQuestionsLoading && !formQuestions) ||
    (!isLabelsLoading && !labels) ||
    answers._tag === 'Left' ||
    formQuestions._tag === 'Left' ||
    labels._tag === 'Left'
  ) {
    return <ErrorModal />;
  }

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="space-between"
        spacing={4}
        sx={{ width: '100%' }}
      >
        <AnswerDetails
          answers={answers.right}
          questions={formQuestions.right}
          labels={labels.right}
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
