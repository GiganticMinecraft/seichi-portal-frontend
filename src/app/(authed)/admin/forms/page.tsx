'use client';

import { Grid, Stack } from '@mui/material';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import { Forms } from './_components/DashboardFormList';
import FormCreateButton from './_components/FormCreateButton';
import FormLabelFilter from './_components/FormLabelFilter';
import ToManageFormLabelButton from './_components/ToManageFormLabelButton';
import type { GetFormLabelsResponse, GetFormsResponse } from '@/lib/api-types';

const Home = () => {
  const {
    data: forms,
    error: formsError,
    isLoading: isLoadingForms,
  } = useSWR<GetFormsResponse>('/api/proxy/forms');
  const {
    data: labels,
    error: labelsError,
    isLoading: isLoadingLabels,
  } = useSWR<GetFormLabelsResponse>('/api/proxy/labels/forms');
  const [labelFilter, setLabelFilter] = useState<GetFormLabelsResponse>([]);

  const filteredForms = useMemo(() => {
    if (!forms) return [];
    if (labelFilter.length === 0) return forms;
    return forms.filter((form) =>
      labelFilter.every((label) =>
        form.labels.map((l) => l.id).includes(label.id)
      )
    );
  }, [labelFilter, forms]);

  if (!forms || !labels) {
    return <LoadingCircular />;
  } else if (
    (!isLoadingForms && formsError) ||
    (!isLoadingLabels && labelsError)
  ) {
    return <ErrorModal />;
  }

  return (
    <Grid container direction="column" justifyContent="flex-start" spacing={4}>
      <Grid>
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="space-between"
        >
          <Grid size="auto">
            <Stack direction="row">
              <FormLabelFilter
                labelOptions={labels}
                setLabelFilter={setLabelFilter}
              />
              <ToManageFormLabelButton />
            </Stack>
          </Grid>
          <Grid size={2}>
            <FormCreateButton />
          </Grid>
        </Grid>
      </Grid>
      <Grid>
        <Forms forms={filteredForms} />
      </Grid>
    </Grid>
  );
};

export default Home;
