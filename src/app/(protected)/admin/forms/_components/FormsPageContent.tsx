'use client';

import { Alert, Button, Snackbar, Stack, Tab, Tabs } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import InfiniteScrollSentinel from '@/app/_components/InfiniteScrollSentinel';
import SnackbarAlert, { useSnackbar } from '@/app/_components/SnackbarAlert';
import { useInfiniteApiQuery } from '@/app/_swr/useInfiniteApiQuery';
import type {
  GetArchivedFormsPageResponse,
  GetFormLabelsResponse,
  GetFormsPageResponse,
} from '@/lib/api-types';

import { useFormListFilters } from '../_hooks/useFormListFilters';

import ArchivedFormsView from './ArchivedFormsView';
import FormsToolbar from './FormsToolbar';
import FormsView from './FormsView';

const FormsPageContent = ({
  initialForms,
  initialArchivedForms,
  labels,
  createdFormId,
}: {
  initialForms: GetFormsPageResponse;
  initialArchivedForms: GetArchivedFormsPageResponse;
  labels: GetFormLabelsResponse;
  createdFormId?: string | undefined;
}) => {
  const router = useRouter();
  const [createdSnackbarOpen, setCreatedSnackbarOpen] = useState(
    createdFormId != null
  );
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState(0);
  const {
    items: forms,
    hasMore: hasMoreForms,
    isLoadingMore: isLoadingMoreForms,
    sentinelRef: formsSentinelRef,
  } = useInfiniteApiQuery(
    '/api/v1/forms',
    (cursor) => ({ query: cursor === undefined ? {} : { cursor } }),
    initialForms
  );
  const {
    items: archivedForms,
    hasMore: hasMoreArchivedForms,
    isLoadingMore: isLoadingMoreArchivedForms,
    sentinelRef: archivedFormsSentinelRef,
  } = useInfiniteApiQuery(
    '/api/v1/archived-forms',
    (cursor) => ({ query: cursor === undefined ? {} : { cursor } }),
    initialArchivedForms
  );
  const { titleSearch, setTitleSearch, setLabelFilter, filteredForms } =
    useFormListFilters(forms);

  useEffect(() => {
    if (createdFormId != null) {
      router.replace('/admin/forms', { scroll: false });
    }
  }, [createdFormId, router]);

  const handleArchiveResult = (result: { ok: boolean }) => {
    if (result.ok) {
      showSnackbar('フォームをアーカイブしました', 'success');
      router.refresh();
    } else {
      showSnackbar('アーカイブに失敗しました', 'error');
    }
  };

  const handleRestoreResult = (result: { ok: boolean }) => {
    if (result.ok) {
      showSnackbar('フォームを復元しました', 'success');
      router.refresh();
    } else {
      showSnackbar('復元に失敗しました', 'error');
    }
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
        <Tab label="アーカイブ済み" />
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
            onResult={handleArchiveResult}
          />
          {hasMoreForms && (
            <InfiniteScrollSentinel
              sentinelRef={formsSentinelRef}
              isLoadingMore={isLoadingMoreForms}
            />
          )}
        </>
      )}
      {activeTab === 1 && (
        <>
          <ArchivedFormsView
            forms={archivedForms}
            onResult={handleRestoreResult}
          />
          {hasMoreArchivedForms && (
            <InfiniteScrollSentinel
              sentinelRef={archivedFormsSentinelRef}
              isLoadingMore={isLoadingMoreArchivedForms}
            />
          )}
        </>
      )}
      <Snackbar
        open={createdSnackbarOpen}
        autoHideDuration={10000}
        onClose={(_event, reason) => {
          if (reason !== 'clickaway') setCreatedSnackbarOpen(false);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          onClose={() => {
            setCreatedSnackbarOpen(false);
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
      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />
    </Stack>
  );
};

export default FormsPageContent;
