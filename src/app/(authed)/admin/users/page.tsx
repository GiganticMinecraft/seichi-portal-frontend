'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import UserList from './_components/UserList';
import adminDashboardTheme from '../theme/adminDashboardTheme';
import type {
  ErrorResponse,
  GetUserListResponse,
} from '@/app/api/_schemas/ResponseSchemas';
import type { Either } from 'fp-ts/lib/Either';

const Home = () => {
  const { data, isLoading } = useSWR<
    Either<ErrorResponse, GetUserListResponse>
  >('/api/users/list', { refreshInterval: 1000 });

  if (!data) {
    return <LoadingCircular />;
  } else if ((!isLoading && !data) || data._tag === 'Left') {
    return <ErrorModal />;
  }

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <UserList users={data.right} />
    </ThemeProvider>
  );
};

export default Home;
