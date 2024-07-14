'use client';

import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import FormList from './_components/FormList';
import type { MinimumForm } from '@/_schemas/formSchema';
import type { ErrorResponse } from '@/app/api/_schemas/ResponseSchemas';
import type { Either } from 'fp-ts/lib/Either';

const Home = () => {
  const { data: forms, isLoading } =
    useSWR<Either<ErrorResponse, MinimumForm[]>>('/api/forms');

  if (!forms) {
    return <LoadingCircular />;
  } else if ((!isLoading && !forms) || forms._tag == 'Left') {
    return <ErrorModal />;
  }

  return <FormList forms={forms.right} />;
};

export default Home;
