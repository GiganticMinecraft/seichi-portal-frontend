'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import FormCreateForm from './_components/FormCreateForm';
import adminDashboardTheme from '../../theme/adminDashboardTheme';

const Home = () => {
  const {
    data: labels,
    error,
    isLoading: isLoadingLabels,
  } = useApiQuery('/labels/forms');

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
