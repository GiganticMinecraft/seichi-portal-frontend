'use client';

import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import FormEditForm from './_components/FormEditForm';
import adminDashboardTheme from '../../../theme/adminDashboardTheme';
import type {
  ErrorResponse,
  GetFormLabelsResponse,
  GetFormResponse,
} from '@/app/api/_schemas/ResponseSchemas';
import type { Either } from 'fp-ts/lib/Either';

const Home = ({ params }: { params: { id: number } }) => {
  const { data: forms, isLoading: isLoadingForms } = useSWR<
    Either<ErrorResponse, GetFormResponse>
  >(`/api/form?formId=${params.id}`);
  const { data: labels, isLoading: isLoadingLabels } =
    useSWR<Either<ErrorResponse, GetFormLabelsResponse>>('/api/labels/forms');

  if (!forms || !labels) {
    return <LoadingCircular />;
  } else if (
    (!isLoadingForms && !forms) ||
    forms._tag === 'Left' ||
    (!isLoadingLabels && !labels) ||
    labels._tag === 'Left'
  ) {
    return <ErrorModal />;
  }

  return (
    <ThemeProvider theme={adminDashboardTheme}>
      <CssBaseline />
      <FormEditForm form={forms.right} labelOptions={labels.right} />
    </ThemeProvider>
  );
};

export default Home;
