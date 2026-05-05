'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import UserList from './_components/UserList';
import adminDashboardTheme from '../theme/adminDashboardTheme';

const Home = () => {
  const { data, error, isLoading } = useApiQuery('/users');

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
