'use client';

import { redirect } from 'next/navigation';
import useSWR from 'swr';
import DashboardMenu from '@/components/DashboardMenu';
import {
  CreateFormButton,
  Forms,
} from '@/features/form/components/DashboardFormList';
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

  return (
    <>
      <DashboardMenu />
      <CreateFormButton />
      <Forms forms={forms} />
    </>
  );
};

export default Home;
