'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import adminDashboardTheme from '../../theme/adminDashboardTheme';
import useSWR from 'swr';
import { Either } from 'fp-ts/lib/Either';
import {
  ErrorResponse,
  GetAnswerLabelsResponse,
} from '@/app/api/_schemas/ResponseSchemas';
import LoadingCircular from '@/app/_components/LoadingCircular';
import ErrorModal from '@/app/_components/ErrorModal';
import Labels from './_components/Labels';

const Home = () => {
  const { data, isLoading } = useSWR<
    Either<ErrorResponse, GetAnswerLabelsResponse>
  >('/api/answers/labels');

  if (!data) {
    return <LoadingCircular />;
  } else if ((!isLoading && !data) || data._tag === 'Left') {
    return <ErrorModal />;
  }

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <Labels labels={data.right} />
    </ThemeProvider>
  );
};

export default Home;
