'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import useSWR from 'swr';
import LoadingCircular from '@/app/_components/LoadingCircular';
import DataTable from './_components/Dashboard';
import adminDashboardTheme from './theme/adminDashboardTheme';
import ErrorModal from '../../_components/ErrorModal';
import type {
  GetAnswersResponse,
  GetFormsResponse,
} from '@/lib/api-types';

const Home = () => {
  const {
    data: answers,
    error: answersError,
    isLoading,
  } = useSWR<GetAnswersResponse>('/api/proxy/forms/answers');

  const {
    data: forms,
    error: formsError,
    isLoading: isLoadingForms,
  } = useSWR<GetFormsResponse>('/api/proxy/forms');

  if (!answers || !forms) {
    return <LoadingCircular />;
  } else if ((!isLoading && answersError) || (!isLoadingForms && formsError)) {
    return <ErrorModal />;
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
