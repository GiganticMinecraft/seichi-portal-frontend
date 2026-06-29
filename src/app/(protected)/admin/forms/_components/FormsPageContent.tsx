'use client';

import { Alert, Button, Snackbar, Stack } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { GetFormLabelsResponse, GetFormsResponse } from '@/lib/api-types';

import { useFormListFilters } from '../_hooks/useFormListFilters';

import FormsToolbar from './FormsToolbar';
import FormsView from './FormsView';

const FormsPageContent = ({
  forms,
  labels,
  createdFormId,
}: {
  forms: GetFormsResponse;
  labels: GetFormLabelsResponse;
  createdFormId?: string | undefined;
}) => {
  const router = useRouter();
  const [snackbarOpen, setSnackbarOpen] = useState(createdFormId != null);
  const { titleSearch, setTitleSearch, setLabelFilter, filteredForms } =
    useFormListFilters(forms);

  useEffect(() => {
    if (createdFormId != null) {
      router.replace('/admin/forms', { scroll: false });
    }
  }, [createdFormId, router]);

  return (
    <Stack spacing={3}>
      <FormsToolbar
        labels={labels}
        titleSearch={titleSearch}
        onTitleSearchChange={setTitleSearch}
        onLabelFilterChange={setLabelFilter}
      />
      <FormsView
        forms={filteredForms}
        onFormClick={(formId) => {
          router.push(`/forms/${formId}/answers`);
        }}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={10000}
        onClose={(_event, reason) => {
          if (reason !== 'clickaway') setSnackbarOpen(false);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          onClose={() => {
            setSnackbarOpen(false);
          }}
          action={
            <Button
              component={Link}
              href={`/admin/forms/edit/${createdFormId ?? ''}`}
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
