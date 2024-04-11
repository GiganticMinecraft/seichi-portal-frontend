'use client';

import { redirect } from 'next/navigation';
import useSWR from 'swr';
import FormList from '@/features/form/components/FormList';
import type { MinimumForm } from '@/_schemas/formSchema';

const Home = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: forms, isLoading } = useSWR<MinimumForm[]>(
    'http://localhost:3000/api/forms',
    fetcher
  );

  if (!isLoading && !forms) {
    redirect('/');
  } else if (!forms) {
    return null;
  }

  return <FormList forms={forms} />;
};

export default Home;
