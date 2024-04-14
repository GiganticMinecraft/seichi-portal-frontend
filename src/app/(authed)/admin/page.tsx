'use client';

import { redirect } from 'next/navigation';
import useSWR from 'swr';
import DataTable from '@/components/Dashboard';
import type { BatchAnswer } from '@/_schemas/formSchema';

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

  return <DataTable answers={answers} />;
};

export default Home;
