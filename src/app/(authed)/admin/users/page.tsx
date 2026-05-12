'use client';

import { useApiQuery } from '@/app/_swr/useApiQuery';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import UserList from './_components/UserList';
import { usePageTitle } from '@/hooks/usePageTitle';

const Home = () => {
  usePageTitle('ユーザー管理');
  const { data, error, isLoading } = useApiQuery('/users');

  if (error) {
    return <ErrorModal />;
  }

  if (isLoading || !data) {
    return <LoadingCircular />;
  }

  return <UserList users={data} />;
};

export default Home;
