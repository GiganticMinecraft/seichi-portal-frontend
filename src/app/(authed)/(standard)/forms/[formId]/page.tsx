'use client';

import { redirect } from 'next/navigation';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import AnswerForm from './_components/AnswerForm';
import type {
  ErrorResponse,
  GetQuestionsResponse,
} from '@/app/api/_schemas/ResponseSchemas';
import type { Either } from 'fp-ts/lib/Either';

const Home = ({ params }: { params: { formId: number } }) => {
  const { data: questions, isLoading } = useSWR<
    Either<ErrorResponse, GetQuestionsResponse>
  >(`/api/questions?formId=${params.formId}`);

  if (!isLoading && !questions) {
    redirect('/');
  } else if (!questions) {
    return null;
  }

  if (questions._tag == 'Left') {
    return <ErrorModal />;
  }

  return <AnswerForm questions={questions.right} formId={params.formId} />;
};

export default Home;
