'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useApiQuery } from '@/app/_swr/useApiQuery';
import { useInfiniteApiQuery } from '@/app/_swr/useInfiniteApiQuery';
import type {
  GetFormAnswersPageResponse,
  GetFormResponse,
} from '@/lib/api-types';

import { toAnswerListRows } from '../_lib/answerListRows';

import AnswersView from './AnswersView';

const SEARCH_DEBOUNCE_MS = 300;

const AnswersPageContent = ({
  form,
  initialAnswers,
}: {
  form: GetFormResponse;
  initialAnswers: GetFormAnswersPageResponse;
}) => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const trimmed = search.trim();
    if (trimmed === '') {
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(trimmed);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (value.trim() === '') {
      setDebouncedSearch('');
    }
  };

  const isSearching = debouncedSearch !== '';

  const {
    items: answers,
    hasMore,
    isLoadingMore,
    loadMore,
  } = useInfiniteApiQuery(
    '/api/v1/forms/{id}/answers',
    (cursor) => ({
      path: { id: form.id },
      query: cursor === undefined ? {} : { cursor },
    }),
    initialAnswers
  );

  const { data: searchData, isLoading: isSearchLoading } = useApiQuery(
    '/api/v1/search/answers',
    isSearching
      ? { query: { query: debouncedSearch, form_id: form.id } }
      : null,
    { keepPreviousData: true }
  );

  const rows = isSearching
    ? toAnswerListRows(searchData?.answers ?? [])
    : toAnswerListRows(answers);

  return (
    <AnswersView
      formTitle={form.title}
      rows={rows}
      search={search}
      onSearchChange={handleSearchChange}
      isSearchLoading={isSearching && isSearchLoading}
      hasMore={!isSearching && hasMore}
      isLoadingMore={isLoadingMore}
      onLoadMore={loadMore}
      onAnswerClick={(answerId) => {
        router.push(`/forms/${form.id}/answers/${answerId}`);
      }}
    />
  );
};

export default AnswersPageContent;
