'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { useApiQuery } from '@/app/_swr/useApiQuery';
import { useInfiniteApiQuery } from '@/app/_swr/useInfiniteApiQuery';
import type {
  GetAnswerLabelsResponse,
  GetFormAnswersPageResponse,
  GetFormResponse,
} from '@/lib/api-types';

import { filterAnswers } from './answerListFilters';
import { toAnswerListRows } from './answerListRows';
import AnswersView from './AnswersView';

const SEARCH_DEBOUNCE_MS = 300;

const AnswersPageContent = ({
  form,
  initialAnswers,
  answersBasePath,
}: {
  form: GetFormResponse;
  initialAnswers: GetFormAnswersPageResponse;
  answersBasePath: string;
}) => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [labelFilter, setLabelFilter] = useState<GetAnswerLabelsResponse>([]);

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

  const sourceAnswers = useMemo(
    () => (isSearching ? (searchData?.answers ?? []) : answers),
    [isSearching, searchData, answers]
  );

  const labelOptions = useMemo(() => {
    const byId = new Map<string, GetAnswerLabelsResponse[number]>();
    for (const answer of sourceAnswers) {
      for (const label of answer.labels) {
        byId.set(label.id, label);
      }
    }
    return Array.from(byId.values());
  }, [sourceAnswers]);

  const rows = toAnswerListRows(
    filterAnswers(sourceAnswers, { labels: labelFilter })
  );

  return (
    <AnswersView
      formTitle={form.title}
      rows={rows}
      search={search}
      onSearchChange={handleSearchChange}
      isSearchLoading={isSearching && isSearchLoading}
      labelOptions={labelOptions}
      onLabelFilterChange={setLabelFilter}
      hasMore={!isSearching && hasMore}
      isLoadingMore={isLoadingMore}
      onLoadMore={loadMore}
      onAnswerClick={(answerId) => {
        router.push(`${answersBasePath}/${answerId}`);
      }}
    />
  );
};

export default AnswersPageContent;
