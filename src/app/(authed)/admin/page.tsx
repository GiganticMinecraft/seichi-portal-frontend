'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { redirect } from 'next/navigation';
import useSWR from 'swr';
import DataTable from './_components/Dashboard';
import adminDashboardTheme from './theme/adminDashboardTheme';
import type {
  GetAnswersResponse,
  GetFormsResponse,
} from '@/app/api/_schemas/ResponseSchemas';

const Home = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: answers, isLoading } = useSWR<GetAnswersResponse[]>(
    '/api/answers',
    fetcher
  );

  const { data: forms, isLoading: isLoadingForms } = useSWR<GetFormsResponse>(
    '/api/forms',
    fetcher
  );

  if ((!isLoading && !answers) || (!isLoadingForms && !forms)) {
    redirect('/');
  } else if (!answers || !forms) {
    return null;
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
