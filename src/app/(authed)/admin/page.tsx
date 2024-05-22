'use client';

import { redirect } from 'next/navigation';
import useSWR from 'swr';
import DataTable from './_components/Dashboard';
import type { GetAnswersResponse } from '@/app/api/_schemas/ResponseSchemas';

const Home = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: answers, isLoading } = useSWR<GetAnswersResponse[]>(
    '/api/answers',
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
