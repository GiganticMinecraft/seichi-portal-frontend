'use client';

import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import { Forms } from './_components/DashboardFormList';
import FormCreateButton from './_components/FormCreateButton';
import FormLabelFilter from './_components/FormLabelFilter';
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
  const [labelFilter, setLabelFilter] = useState<GetFormLabelsResponse>([]);
  const [filteredForms, setFilteredForms] = useState<GetFormsResponse>([]);

  useEffect(() => {
    if (forms?._tag === 'Right' && labelFilter.length === 0) {
      setFilteredForms(forms.right);
    } else if (forms?._tag === 'Right' && labelFilter.length !== 0) {
      setFilteredForms(
        forms.right.filter((form) =>
          labelFilter.every((label) =>
            form.labels.map((label) => label.id).includes(label.id)
          )
        )
      );
    }
  }, [labelFilter, forms]);

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
            <FormLabelFilter
              labelOptions={labels.right}
              setLabelFilter={setLabelFilter}
            />
          </Grid>
          <Grid item xs={2}>
            <FormCreateButton />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Forms forms={filteredForms} />
      </Grid>
    </Grid>
  );
};

export default Home;
