'use client';

import { use } from 'react';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import AnswerForm from './_components/AnswerForm';
import type {
  ErrorResponse,
  GetQuestionsResponse,
} from '@/app/api/_schemas/ResponseSchemas';
import type { Either } from 'fp-ts/lib/Either';

const Home = ({ params }: { params: Promise<{ formId: string }> }) => {
  const { formId } = use(params);
  const { data: questions, isLoading } = useSWR<
    Either<ErrorResponse, GetQuestionsResponse>
  >(`/api/proxy/forms/${formId}/questions`);

  if (!questions) {
    return <LoadingCircular />;
  } else if ((!isLoading && !questions) || questions._tag == 'Left') {
    return <ErrorModal />;
  }

  return <AnswerForm questions={questions.right} formId={formId} />;
};

export default Home;
