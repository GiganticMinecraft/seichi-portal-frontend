'use client';

import { CssBaseline, Stack, ThemeProvider, Typography } from '@mui/material';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import adminDashboardTheme from '../../theme/adminDashboardTheme';
import CreateLabelField from '../_components/CreateLabelField';
import Labels from '../_components/Labels';

const Home = () => {
  const { data, error, isLoading } = useApiQuery('/labels/answers');

  if (error) {
    return <ErrorModal />;
  }

  if (isLoading || !data) {
    return <LoadingCircular />;
  }

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <Stack spacing={3} sx={{ width: '100%' }}>
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
          spacing={2}
        >
          <Typography variant="h4">回答設定用ラベル管理</Typography>
          <CreateLabelField />
        </Stack>
        <Labels labels={data} />
      </Stack>
    </ThemeProvider>
  );
};

export default Home;
