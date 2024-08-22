'use client';

import { CssBaseline, Stack, ThemeProvider } from '@mui/material';
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
import CreateLabelField from './_components/CreateLabelField';

const Home = () => {
  const { data, isLoading } = useSWR<
    Either<ErrorResponse, GetAnswerLabelsResponse>
  >('/api/answers/labels', { refreshInterval: 1000 });

  if (!data) {
    return <LoadingCircular />;
  } else if ((!isLoading && !data) || data._tag === 'Left') {
    return <ErrorModal />;
  }

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <Stack spacing={2} sx={{ width: '100%' }}>
        <CreateLabelField />
        <Labels labels={data.right} />
      </Stack>
    </ThemeProvider>
  );
};

export default Home;
