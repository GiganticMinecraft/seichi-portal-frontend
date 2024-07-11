'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { redirect } from 'next/navigation';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import AnswerDetails from './_components/AnswerDetails';
import adminDashboardTheme from '../../theme/adminDashboardTheme';
import type {
  ErrorResponse,
  GetAnswerResponse,
  GetQuestionsResponse,
} from '@/app/api/_schemas/ResponseSchemas';

const Home = ({ params }: { params: { answerId: string } }) => {
  const {
    data: answers,
    isLoading: isAnswersLoading,
    error: answersFetchError,
  } = useSWR<GetAnswerResponse, ErrorResponse>(
    `/api/answers/${params.answerId}`
  );

  const {
    data: formQuestions,
    isLoading: isFormQuestionsLoading,
    error: questionsFetchError,
  } = useSWR<GetQuestionsResponse, ErrorResponse>(
    answers ? `/api/questions?formId=${answers.form_id}` : ''
  );

  if (!isAnswersLoading && !answers) {
    redirect('/');
  } else if (!answers) {
    return null;
  }

  if (!isFormQuestionsLoading && !formQuestions) {
    redirect('/');
  } else if (!formQuestions) {
    return null;
  }

  const isErrorOccurred =
    questionsFetchError !== undefined || answersFetchError !== undefined;

  if (isErrorOccurred) {
    return <ErrorModal isErrorOccurred={isErrorOccurred} />;
  }

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <AnswerDetails answers={answers} questions={formQuestions} />
    </ThemeProvider>
  );
};

export default Home;
