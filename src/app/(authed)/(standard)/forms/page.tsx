'use client';

import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import FormList from './_components/FormList';
import type { GetFormsResponse } from '@/lib/api-types';

const Home = () => {
  const {
    data: forms,
    error,
    isLoading,
  } = useSWR<GetFormsResponse>('/api/proxy/forms');

  if (isLoading || !forms) {
    return <LoadingCircular />;
  } else if (error) {
    return <ErrorModal />;
  }

  return <FormList forms={forms} />;
};

export default Home;
