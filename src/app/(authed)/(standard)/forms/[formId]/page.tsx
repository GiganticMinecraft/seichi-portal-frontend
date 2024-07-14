'use client';

import { redirect } from 'next/navigation';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import AnswerForm from './_components/AnswerForm';
import type {
  ErrorResponse,
  GetQuestionsResponse,
} from '@/app/api/_schemas/ResponseSchemas';

const Home = ({ params }: { params: { formId: number } }) => {
  const {
    data: questions,
    isLoading,
    error,
  } = useSWR<GetQuestionsResponse, ErrorResponse>(
    `/api/questions?formId=${params.formId}`
  );

  if (!isLoading && !questions) {
    redirect('/');
  } else if (!questions) {
    return null;
  }

  const isErrorOccurred = error !== undefined;

  if (isErrorOccurred) {
    return <ErrorModal />;
  }

  return <AnswerForm questions={questions} formId={params.formId} />;
};

export default Home;
