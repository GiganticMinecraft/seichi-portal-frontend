'use client';

import { redirect } from 'next/navigation';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import FormList from './_components/FormList';
import type { MinimumForm } from '@/_schemas/formSchema';
import type { ErrorResponse } from '@/app/api/_schemas/ResponseSchemas';

const Home = () => {
  const {
    data: forms,
    isLoading,
    error,
  } = useSWR<MinimumForm[], ErrorResponse>('/api/forms');

  if (!isLoading && !forms) {
    redirect('/');
  } else if (!forms) {
    return null;
  }

  const isErrorOccurred = error !== undefined;

  if (isErrorOccurred) {
    return <ErrorModal />;
  }

  return <FormList forms={forms} />;
};

export default Home;
