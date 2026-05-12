'use client';

import { Stack, Typography } from '@mui/material';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import CreateLabelField from './_components/CreateLabelField';
import Labels from './_components/Labels';
import { usePageTitle } from '@/hooks/usePageTitle';

const Home = () => {
  usePageTitle('フォーム設定用ラベル管理');
  const { data, error, isLoading } = useApiQuery('/labels/forms');

  if (error) {
    return <ErrorModal />;
  }

  if (isLoading || !data) {
    return <LoadingCircular />;
  }

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography variant="h4">フォーム設定用ラベル管理</Typography>
        <CreateLabelField />
      </Stack>
      <Labels labels={data} />
    </Stack>
  );
};

export default Home;
