'use client';

import { Box, Typography } from '@mui/material';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import FormList from './_components/FormList';
import { useApiQuery } from '@/app/_swr/useApiQuery';

const Home = () => {
  const { data: forms, error, isLoading } = useApiQuery('/forms');

  if (error) {
    return <ErrorModal error={error} />;
  }

  if (isLoading || !forms) {
    return <LoadingCircular />;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        フォーム一覧
      </Typography>
      <FormList forms={forms} />
    </Box>
  );
};

export default Home;
