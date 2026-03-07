'use client';

import { use } from 'react';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import AnswerForm from './_components/AnswerForm';
import type { GetQuestionsResponse } from '@/lib/api-schema-types';

const Home = ({ params }: { params: Promise<{ formId: string }> }) => {
  const { formId } = use(params);
  const {
    data: questions,
    error,
    isLoading,
  } = useSWR<GetQuestionsResponse>(`/api/proxy/forms/${formId}/questions`);

  if (!questions) {
    return <LoadingCircular />;
  } else if (!isLoading && error) {
    return <ErrorModal />;
  }

  return <AnswerForm questions={questions} formId={formId} />;
};

export default Home;
