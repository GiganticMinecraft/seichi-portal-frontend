'use client';

import { use } from 'react';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import AnswerForm from './_components/AnswerForm';
import { usePageTitle } from '@/hooks/usePageTitle';

const Home = ({ params }: { params: Promise<{ formId: string }> }) => {
  usePageTitle('フォーム回答');
  const { formId } = use(params);
  const {
    data: form,
    error,
    isLoading,
  } = useApiQuery('/forms/{id}', {
    path: { id: formId },
  });

  if (error) {
    return <ErrorModal error={error} />;
  }

  if (isLoading || !form) {
    return <LoadingCircular />;
  }

  return (
    <AnswerForm
      questions={form.questions}
      formId={formId}
      title={form.title}
      description={form.description}
    />
  );
};

export default Home;
