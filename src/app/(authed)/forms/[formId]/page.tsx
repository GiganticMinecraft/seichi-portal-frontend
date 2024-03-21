'use client';

import { redirect } from 'next/navigation';
import useSWR from 'swr';
import AnswerForm from '@/features/form/components/AnswerForm';
import type { FormQuestion } from '@/features/form/types/formSchema';

const Home = ({ params }: { params: { formId: number } }) => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: questions, isLoading } = useSWR<FormQuestion[]>(
    `http://localhost:3000/api/questions?formId=${params.formId}`,
    fetcher
  );

  if (!isLoading && !questions) {
    redirect('/');
  } else if (!questions) {
    return null;
  }

  return <AnswerForm questions={questions} formId={params.formId} />;
};

export default Home;
