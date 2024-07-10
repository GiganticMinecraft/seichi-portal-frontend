'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { redirect } from 'next/navigation';
import useSWR from 'swr';
import AnswerDetails from './_components/AnswerDetails';
import adminDashboardTheme from '../../theme/adminDashboardTheme';
import type {
  GetAnswerResponse,
  GetQuestionsResponse,
} from '@/app/api/_schemas/ResponseSchemas';

const Home = ({ params }: { params: { answerId: string } }) => {
  const { data: answers, isLoading: isAnswersLoading } =
    useSWR<GetAnswerResponse>(`/api/answers/${params.answerId}`);

  const { data: formQuestions, isLoading: isFormQuestionsLoading } =
    useSWR<GetQuestionsResponse>(
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

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <AnswerDetails answers={answers} questions={formQuestions} />
    </ThemeProvider>
  );
};

export default Home;
