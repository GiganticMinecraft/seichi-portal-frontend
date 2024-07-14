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
import type { Either } from 'fp-ts/lib/Either';

const Home = () => {
  const { data: answers, isLoading } =
    useSWR<Either<ErrorResponse, GetAnswersResponse[]>>('/api/answers');

  const { data: forms, isLoading: isLoadingForms } =
    useSWR<Either<ErrorResponse, GetFormsResponse>>('/api/forms');

  if ((!isLoading && !answers) || (!isLoadingForms && !forms)) {
    redirect('/');
  } else if (!answers || !forms) {
    return null;
  }

  if (answers._tag === 'Left' || forms._tag === 'Left') {
    return <ErrorModal />;
  }

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <DataTable
        answerResponseWithFormTitle={answers.right.map((answer) => {
          return {
            ...answer,
            form_title:
              forms.right.find((form) => form.id === answer.form_id)?.title ??
              'unknown form',
          };
        })}
      />
    </ThemeProvider>
  );
};

export default Home;
