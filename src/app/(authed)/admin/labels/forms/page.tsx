'use client';

import { CssBaseline, Stack, ThemeProvider, Typography } from '@mui/material';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import CreateLabelField from './_components/CreateLabelField';
import Labels from './_components/Labels';
import adminDashboardTheme from '../../theme/adminDashboardTheme';

const Home = () => {
  const { data, error, isLoading } = useApiQuery('/labels/forms');

  if (error) {
    return <ErrorModal />;
  }

  if (isLoading || !data) {
    return <LoadingCircular />;
  }

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Typography variant="h4">フォーム設定用ラベル管理</Typography>
        <CreateLabelField />
        <Labels labels={data} />
      </Stack>
    </ThemeProvider>
  );
};

export default Home;
