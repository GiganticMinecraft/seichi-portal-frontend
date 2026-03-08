'use client';

import { CssBaseline, Stack, ThemeProvider } from '@mui/material';
import { use } from 'react';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import AnswerDetails from './_components/AnswerDetails';
import Comments from './_components/Comments';
import adminDashboardTheme from '../../theme/adminDashboardTheme';
import type {
  AnswerCommentType,
  GetAnswerLabelsResponse,
  GetAnswerResponse,
  GetQuestionsResponse,
} from '@/lib/api-types';

const Home = ({ params }: { params: Promise<{ answerId: number }> }) => {
  const { answerId } = use(params);
  const {
    data: answers,
    error: answersError,
    isLoading: isAnswersLoading,
  } = useSWR<GetAnswerResponse>(`/api/proxy/forms/answers/${answerId}`, {
    refreshInterval: 1000,
  });

  const {
    data: formQuestions,
    error: formQuestionsError,
    isLoading: isFormQuestionsLoading,
  } = useSWR<GetQuestionsResponse>(
    answers ? `/api/proxy/forms/${answers.form_id}/questions` : null
  );

  const {
    data: labels,
    error: labelsError,
    isLoading: isLabelsLoading,
  } = useSWR<GetAnswerLabelsResponse>('/api/proxy/forms/labels/answers');

  if (!answers || !formQuestions || !labels) {
    return <LoadingCircular />;
  } else if (
    (!isAnswersLoading && answersError) ||
    (!isFormQuestionsLoading && formQuestionsError) ||
    (!isLabelsLoading && labelsError)
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
          answers={answers}
          questions={formQuestions}
          labels={labels}
        />
        <Comments
          comments={answers.comments as AnswerCommentType[]}
          answerId={answerId}
        />
      </Stack>
    </ThemeProvider>
  );
};

export default Home;
