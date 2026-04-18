'use client';

import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { use } from 'react';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import FormEditForm from './_components/FormEditForm';
import adminDashboardTheme from '../../../theme/adminDashboardTheme';
import type { GetFormLabelsResponse, GetFormResponse } from '@/lib/api-types';

const Home = ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = use(params);
  const {
    data: form,
    error: formError,
    isLoading: isLoadingForms,
  } = useSWR<GetFormResponse>(`/api/proxy/forms/${id}`);
  const {
    data: labels,
    error: labelsError,
    isLoading: isLoadingLabels,
  } = useSWR<GetFormLabelsResponse>('/api/proxy/labels/forms');

  if (!form || !labels) {
    return <LoadingCircular />;
  } else if (
    (!isLoadingForms && formError) ||
    (!isLoadingLabels && labelsError)
  ) {
    return <ErrorModal />;
  }

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <FormEditForm form={form} labelOptions={labels} />
    </ThemeProvider>
  );
};

export default Home;
