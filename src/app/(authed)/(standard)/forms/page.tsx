'use client';

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

  return <FormList forms={forms} />;
};

export default Home;
