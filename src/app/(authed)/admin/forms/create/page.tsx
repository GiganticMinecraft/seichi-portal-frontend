'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import FormCreateForm from './_components/FormCreateForm';
import adminDashboardTheme from '../../theme/adminDashboardTheme';
import type { GetFormLabelsResponse } from '@/lib/api-types';

const Home = () => {
  const {
    data: labels,
    error,
    isLoading: isLoadingLabels,
  } = useSWR<GetFormLabelsResponse>('/api/proxy/labels/forms');

  if (error) {
    return <ErrorModal />;
  }

  if (isLoadingLabels || !labels) {
    return <LoadingCircular />;
  }

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <FormCreateForm labelOptions={labels} />
    </ThemeProvider>
  );
};

export default Home;
