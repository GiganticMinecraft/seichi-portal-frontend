'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import LoadingCircular from '@/app/_components/LoadingCircular';
import DataTable from './_components/Dashboard';
import adminDashboardTheme from './theme/adminDashboardTheme';
import ErrorModal from '../../_components/ErrorModal';

const Home = () => {
  const {
    data: answers,
    error: answersError,
    isLoading,
  } = useApiQuery('/forms/answers');

  const {
    data: forms,
    error: formsError,
    isLoading: isLoadingForms,
  } = useApiQuery('/forms');

  if (answersError || formsError) {
    return <ErrorModal />;
  }

  if (isLoading || isLoadingForms || !answers || !forms) {
    return <LoadingCircular />;
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
