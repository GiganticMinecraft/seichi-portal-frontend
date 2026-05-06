'use client';

import { useApiQuery } from '@/app/_swr/useApiQuery';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import FormCreateForm from './_components/FormCreateForm';

const Home = () => {
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
