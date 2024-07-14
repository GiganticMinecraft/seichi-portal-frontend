'use client';

import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { redirect } from 'next/navigation';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import FormEditForm from './_components/FormEditForm';
import adminDashboardTheme from '../../../theme/adminDashboardTheme';
import type {
  ErrorResponse,
  GetFormResponse,
} from '@/app/api/_schemas/ResponseSchemas';
import type { Either } from 'fp-ts/lib/Either';

const Home = ({ params }: { params: { id: number } }) => {
  const { data, isLoading } = useSWR<Either<ErrorResponse, GetFormResponse>>(
    `/api/form?formId=${params.id}`
  );

  if (!isLoading && !data) {
    redirect('/');
  } else if (!data) {
    return null;
  }

  if (data._tag === 'Left') {
    return <ErrorModal />;
  }

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <FormEditForm form={data.right} />
    </ThemeProvider>
  );
};

export default Home;
