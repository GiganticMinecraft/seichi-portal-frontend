'use client';

import { use } from 'react';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import FormEditForm from './_components/FormEditForm';

const Home = ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = use(params);
  const {
    data: form,
    error: formError,
    isLoading: isLoadingForms,
  } = useApiQuery('/forms/{id}', {
    path: { id: String(id) },
  });
  const {
    data: labels,
    error: labelsError,
    isLoading: isLoadingLabels,
  } = useApiQuery('/labels/forms');

  if (formError || labelsError) {
    return <ErrorModal />;
  }

  if (isLoadingForms || isLoadingLabels || !form || !labels) {
    return <LoadingCircular />;
  }

  return <FormEditForm form={form} labelOptions={labels} />;
};

export default Home;
