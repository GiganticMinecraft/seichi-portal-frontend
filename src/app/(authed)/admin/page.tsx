'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { redirect } from 'next/navigation';
import useSWR from 'swr';
import DataTable from './_components/Dashboard';
import adminDashboardTheme from './theme/adminDashboardTheme';
import ErrorModal from '../../_components/ErrorModal';
import type {
  ErrorResponse,
  GetAnswersResponse,
  GetFormsResponse,
} from '@/app/api/_schemas/ResponseSchemas';

const Home = () => {
  const {
    data: answers,
    isLoading,
    error: answersError,
  } = useSWR<GetAnswersResponse[], ErrorResponse>('/api/answers');

  const {
    data: forms,
    isLoading: isLoadingForms,
    error: formsError,
  } = useSWR<GetFormsResponse, ErrorResponse>('/api/forms');

  if ((!isLoading && !answers) || (!isLoadingForms && !forms)) {
    redirect('/');
  } else if (!answers || !forms) {
    return null;
  }

  const isErrorOccurred =
    answersError !== undefined || formsError !== undefined;

  if (isErrorOccurred) {
    return <ErrorModal isErrorOccurred={isErrorOccurred} />;
  }

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <DataTable
        answerResponseWithFormTitle={answers.map((answer) => {
          return {
            ...answer,
            form_title:
              forms.find((form) => form.id === answer.form_id)?.title ??
              'unknown form',
          };
        })}
      />
    </ThemeProvider>
  );
};

export default Home;
