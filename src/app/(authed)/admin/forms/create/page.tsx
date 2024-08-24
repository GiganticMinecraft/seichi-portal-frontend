'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import FormCreateForm from './_components/FormCreateForm';
import adminDashboardTheme from '../../theme/adminDashboardTheme';
import type {
  ErrorResponse,
  GetFormLabelsResponse,
} from '@/app/api/_schemas/ResponseSchemas';
import type { Either } from 'fp-ts/lib/Either';

const Home = () => {
  const { data: labels, isLoading: isLoadingLabels } =
    useSWR<Either<ErrorResponse, GetFormLabelsResponse>>('/api/labels/forms');

  if (!labels) {
    return <LoadingCircular />;
  } else if ((!isLoadingLabels && !labels) || labels._tag === 'Left') {
    return <ErrorModal />;
  }

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <FormCreateForm labelOptions={labels.right} />
    </ThemeProvider>
  );
};

export default Home;
