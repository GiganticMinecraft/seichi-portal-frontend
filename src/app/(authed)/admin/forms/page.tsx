'use client';

import { Grid, Stack } from '@mui/material';
import { useMemo, useState } from 'react';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import { Forms } from './_components/DashboardFormList';
import FormCreateButton from './_components/FormCreateButton';
import FormLabelFilter from './_components/FormLabelFilter';
import ToManageFormLabelButton from './_components/ToManageFormLabelButton';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { GetFormLabelsResponse } from '@/lib/api-types';

const Home = () => {
  usePageTitle('フォーム管理');
  const {
    data: forms,
    error: formsError,
    isLoading: isLoadingForms,
  } = useApiQuery('/forms');
  const {
    data: labels,
    error: labelsError,
    isLoading: isLoadingLabels,
  } = useApiQuery('/labels/forms');
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

  if (formsError || labelsError) {
    return <ErrorModal />;
  }

  if (isLoadingForms || isLoadingLabels || !forms || !labels) {
    return <LoadingCircular />;
  }

  return (
    <Grid
      container
      spacing={4}
      sx={{ flexDirection: 'column', justifyContent: 'flex-start' }}
    >
      <Grid>
        <Grid
          container
          spacing={2}
          direction="row"
          sx={{ justifyContent: 'space-between' }}
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
