'use client';

import { Grid, Stack } from '@mui/material';
import { useMemo, useState } from 'react';
import { Forms } from './DashboardFormList';
import FormCreateButton from './FormCreateButton';
import FormLabelFilter from './FormLabelFilter';
import ToManageFormLabelButton from './ToManageFormLabelButton';
import type { GetFormLabelsResponse, GetFormsResponse } from '@/lib/api-types';

const FormsPageContent = ({
  forms,
  labels,
}: {
  forms: GetFormsResponse;
  labels: GetFormLabelsResponse;
}) => {
  const [labelFilter, setLabelFilter] = useState<GetFormLabelsResponse>([]);

  const filteredForms = useMemo(() => {
    if (labelFilter.length === 0) return forms;
    return forms.filter((form) =>
      labelFilter.every((label) =>
        form.labels.map((formLabel) => formLabel.id).includes(label.id)
      )
    );
  }, [forms, labelFilter]);

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

export default FormsPageContent;
