'use client';

import { Stack } from '@mui/material';
import { useMemo, useState } from 'react';
import FormsTable from './FormsTable';
import FormsToolbar from './FormsToolbar';
import type { GetFormLabelsResponse, GetFormsResponse } from '@/lib/api-types';

const FormsPageContent = ({
  forms,
  labels,
}: {
  forms: GetFormsResponse;
  labels: GetFormLabelsResponse;
}) => {
  const [titleSearch, setTitleSearch] = useState('');
  const [labelFilter, setLabelFilter] = useState<GetFormLabelsResponse>([]);

  const filteredForms = useMemo(() => {
    const normalizedSearch = titleSearch.trim().toLowerCase();
    return forms.filter((form) => {
      const matchesTitle =
        normalizedSearch.length === 0 ||
        form.title.toLowerCase().includes(normalizedSearch);
      const matchesLabels =
        labelFilter.length === 0 ||
        labelFilter.every((label) =>
          form.labels.some((formLabel) => formLabel.id === label.id)
        );
      return matchesTitle && matchesLabels;
    });
  }, [forms, titleSearch, labelFilter]);

  return (
    <Stack spacing={3}>
      <FormsToolbar
        labels={labels}
        titleSearch={titleSearch}
        onTitleSearchChange={setTitleSearch}
        onLabelFilterChange={setLabelFilter}
      />
      <FormsTable forms={filteredForms} />
    </Stack>
  );
};

export default FormsPageContent;
