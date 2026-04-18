'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import UserList from './_components/UserList';
import adminDashboardTheme from '../theme/adminDashboardTheme';
import type { GetUserListResponse } from '@/lib/api-types';

const Home = () => {
  const { data, error, isLoading } = useSWR<GetUserListResponse>(
    '/api/proxy/users/list'
  );

  if (error) {
    return <ErrorModal />;
  }

  if (isLoading || !data) {
    return <LoadingCircular />;
  }

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <UserList users={data} />
    </ThemeProvider>
  );
};

export default Home;
