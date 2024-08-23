'use client';

import { CssBaseline, Stack, ThemeProvider, Typography } from '@mui/material';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import CreateLabelField from './_components/CreateLabelField';
import Labels from './_components/Labels';
import adminDashboardTheme from '../../theme/adminDashboardTheme';
import type {
  ErrorResponse,
  GetAnswerLabelsResponse,
} from '@/app/api/_schemas/ResponseSchemas';
import type { Either } from 'fp-ts/lib/Either';

const Home = () => {
  const { data, isLoading } = useSWR<
    Either<ErrorResponse, GetAnswerLabelsResponse>
  >('/api/labels/forms', { refreshInterval: 1000 });

  if (!data) {
    return <LoadingCircular />;
  } else if ((!isLoading && !data) || data._tag === 'Left') {
    return <ErrorModal />;
  }

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Typography variant="h4">フォーム設定用ラベル管理</Typography>
        <CreateLabelField />
        <Labels labels={data.right} />
      </Stack>
    </ThemeProvider>
  );
};

export default Home;
