'use client';

import { Grid } from '@mui/material';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import { Forms } from './_components/DashboardFormList';
import FormCreateButton from './_components/FormCreateButton';
import FormTagFilter from './_components/FormTagFilter';
import type {
  ErrorResponse,
  GetFormLabelsResponse,
  GetFormsResponse,
} from '@/app/api/_schemas/ResponseSchemas';
import type { Either } from 'fp-ts/lib/Either';

const Home = () => {
  const { data: forms, isLoading: isLoadingForms } =
    useSWR<Either<ErrorResponse, GetFormsResponse>>('/api/forms');
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
    <Grid container direction="column" justifyContent="flex-start" spacing={4}>
      <Grid item>
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="space-between"
        >
          <Grid item xs="auto">
            <FormTagFilter labelOptions={labels.right} />
          </Grid>
          <Grid item xs={2}>
            <FormCreateButton />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Forms forms={forms.right} />
      </Grid>
    </Grid>
  );
};

export default Home;
