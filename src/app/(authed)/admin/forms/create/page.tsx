'use client';

import { useApiQuery } from '@/app/_swr/useApiQuery';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import FormCreateForm from './_components/FormCreateForm';
import { usePageTitle } from '@/hooks/usePageTitle';

const Home = () => {
  usePageTitle('フォーム作成');
  const {
    data: labels,
    error,
    isLoading: isLoadingLabels,
  } = useApiQuery('/labels/forms');

  if (error) {
    return <ErrorModal />;
  }

  if (isLoadingLabels || !labels) {
    return <LoadingCircular />;
  }

  return <FormCreateForm labelOptions={labels} />;
};

export default Home;
