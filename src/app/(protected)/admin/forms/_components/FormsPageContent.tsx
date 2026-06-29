'use client';

import { Alert, Button, Snackbar, Stack } from '@mui/material';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import FormsTable from './FormsTable';
import FormsToolbar from './FormsToolbar';
import type { GetFormLabelsResponse, GetFormsResponse } from '@/lib/api-types';

const FormsPageContent = ({
  forms,
  labels,
  createdFormId,
}: {
  forms: GetFormsResponse;
  labels: GetFormLabelsResponse;
  createdFormId?: string | undefined;
}) => {
  const [titleSearch, setTitleSearch] = useState('');
  const [labelFilter, setLabelFilter] = useState<GetFormLabelsResponse>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(createdFormId != null);

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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={10000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          onClose={() => setSnackbarOpen(false)}
          action={
            <Button
              component={Link}
              href={`/admin/forms/edit/${createdFormId}`}
              color="inherit"
              size="small"
            >
              編集画面へ
            </Button>
          }
        >
          フォームを作成しました
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default FormsPageContent;
