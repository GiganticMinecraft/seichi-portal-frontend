'use client';

import { CssBaseline, Stack, ThemeProvider, Typography } from '@mui/material';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import adminDashboardTheme from '../../theme/adminDashboardTheme';
import CreateLabelField from '../_components/CreateLabelField';
import Labels from '../_components/Labels';
import type { GetAnswerLabelsResponse } from '@/lib/api-schema-types';

const Home = () => {
  const { data, error, isLoading } = useSWR<GetAnswerLabelsResponse>(
    '/api/proxy/forms/labels/answers',
    { refreshInterval: 1000 }
  );

  if (!data) {
    return <LoadingCircular />;
  } else if (!isLoading && error) {
    return <ErrorModal />;
  }

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Typography variant="h4">回答設定用ラベル管理</Typography>
        <CreateLabelField />
        <Labels labels={data} />
      </Stack>
    </ThemeProvider>
  );
};

export default Home;
