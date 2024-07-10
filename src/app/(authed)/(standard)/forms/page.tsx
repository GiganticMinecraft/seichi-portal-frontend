'use client';

import { redirect } from 'next/navigation';
import useSWR from 'swr';
import FormList from './_components/FormList';
import type { MinimumForm } from '@/_schemas/formSchema';

const Home = () => {
  const { data: forms, isLoading } = useSWR<MinimumForm[]>('/api/forms');

  if (!isLoading && !forms) {
    redirect('/');
  } else if (!forms) {
    return null;
  }

  return <FormList forms={forms} />;
};

export default Home;
