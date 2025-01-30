'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import useSWR from 'swr';
import LoadingCircular from '@/app/_components/LoadingCircular';
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
  const { data: answers, isLoading } = useSWR<
    Either<ErrorResponse, GetAnswersResponse>
  >('/api/proxy/forms/answers');

  const { data: forms, isLoading: isLoadingForms } =
    useSWR<Either<ErrorResponse, GetFormsResponse>>('/api/proxy/forms');

  if (!answers || !forms) {
    return <LoadingCircular />;
  } else if (
    (!isLoading && !answers) ||
    (!isLoadingForms && !forms) ||
    answers._tag === 'Left' ||
    forms._tag === 'Left'
  ) {
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
