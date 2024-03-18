'use client';

import DataTable from '@/components/Dashboard';
import DashboardMenu from '@/components/DashboardMenu';
import { BatchAnswer } from '@/features/form/types/formSchema';
import useSWR from 'swr';
import { redirect } from 'next/navigation';

const Home = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: answers, isLoading } = useSWR<BatchAnswer[]>(
    'http://localhost:3000/api/answers',
    fetcher
  );

  if (!isLoading && !answers) {
    redirect('/');
  } else if (!answers) {
    return null;
  }

  return (
    <>
      <DashboardMenu />
      <DataTable answers={answers} />
    </>
  );
};

export default Home;
