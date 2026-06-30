'use client';

import { Alert, Button, Snackbar, Stack, Tab, Tabs } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import type {
  GetArchivedFormsResponse,
  GetFormLabelsResponse,
  GetFormsResponse,
} from '@/lib/api-types';

import { useFormListFilters } from '../_hooks/useFormListFilters';

import ArchivedFormsView from './ArchivedFormsView';
import FormsToolbar from './FormsToolbar';
import FormsView from './FormsView';

const FormsPageContent = ({
  forms,
  archivedForms,
  labels,
  createdFormId,
}: {
  forms: GetFormsResponse;
  archivedForms: GetArchivedFormsResponse;
  labels: GetFormLabelsResponse;
  createdFormId?: string | undefined;
}) => {
  const router = useRouter();
  const [snackbarOpen, setSnackbarOpen] = useState(createdFormId != null);
  const [activeTab, setActiveTab] = useState(0);
  const { titleSearch, setTitleSearch, setLabelFilter, filteredForms } =
    useFormListFilters(forms);

  useEffect(() => {
    if (createdFormId != null) {
      router.replace('/admin/forms', { scroll: false });
    }
  }, [createdFormId, router]);

  const handleMutated = () => {
    router.refresh();
  };

  return (
    <Stack spacing={3}>
      <Tabs
        value={activeTab}
        onChange={(_event, newValue: number) => {
          setActiveTab(newValue);
        }}
      >
        <Tab label="アクティブ" />
        <Tab label={`アーカイブ済み（${archivedForms.length}）`} />
      </Tabs>
      {activeTab === 0 && (
        <>
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
            onArchived={handleMutated}
          />
        </>
      )}
      {activeTab === 1 && (
        <ArchivedFormsView forms={archivedForms} onRestored={handleMutated} />
      )}
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
