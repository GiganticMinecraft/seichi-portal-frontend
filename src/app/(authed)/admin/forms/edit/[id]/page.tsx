'use client';

import { redirect } from 'next/navigation';
import useSWR from 'swr';
import DashboardMenu from '@/components/DashboardMenu';
import { EditFormComponent } from '@/features/form/components/editForm';
import type { Form } from '@/features/form/types/formSchema';

const Home = ({ params }: { params: { id: number } }) => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, isLoading } = useSWR<Form>(
    `http://localhost:3000/api/form?formId=${params.id}`,
    fetcher
  );

  if (!isLoading && !data) {
    redirect('/');
  } else if (!data) {
    return null;
  }

  return (
    <>
      <DashboardMenu />
      <EditFormComponent form={data} />
    </>
  );
};

export default Home;
