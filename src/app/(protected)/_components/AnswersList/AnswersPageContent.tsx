'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { useApiQuery } from '@/app/_swr/useApiQuery';
import { useInfiniteApiQuery } from '@/app/_swr/useInfiniteApiQuery';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import type {
  GetAnswerLabelsResponse,
  GetFormAnswersPageResponse,
  GetFormResponse,
} from '@/lib/api-types';
import type { AnswerOpenState } from '@/lib/forms/answerStatus';

import { filterAnswers } from './answerListFilters';
import { toAnswerListRows } from './answerListRows';
import AnswersView from './AnswersView';

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
  const { search, debouncedSearch, isSearching, handleSearchChange } =
    useDebouncedSearch();
  const [labelFilter, setLabelFilter] = useState<GetAnswerLabelsResponse>([]);
  const [openState, setOpenState] = useState<AnswerOpenState>('open');

  const {
    items: answers,
    hasMore,
    isLoadingMore,
    loadMore,
  } = useInfiniteApiQuery(
    '/api/v1/forms/{form_id}/answers',
    (cursor) => ({
      path: { form_id: form.id },
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

  // 未完了/完了・ラベルでの絞り込みはクライアントサイドで行う。openState は常に
  // 'open' か 'closed' のいずれかで絞り込みが有効な状態にあるため、hasMore が false
  // になるまで残りページを読み込みきる。DataGrid の仮想スクロールは絞り込み後の
  // 表示件数がコンテナ高さに満たないとスクロールイベントが発生せず、残りページの
  // 自動読み込みが起きないため。
  useEffect(() => {
    if (!isSearching && hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [isSearching, hasMore, isLoadingMore, loadMore]);

  const isPrefetchingForFilter = !isSearching && hasMore;

  const rows = toAnswerListRows(
    filterAnswers(sourceAnswers, { labels: labelFilter, openState })
  );

  return (
    <AnswersView
      formTitle={form.title}
      rows={rows}
      search={search}
      onSearchChange={handleSearchChange}
      isSearchLoading={isSearching && isSearchLoading}
      isPrefetchingForFilter={isPrefetchingForFilter}
      labelOptions={labelOptions}
      onLabelFilterChange={setLabelFilter}
      openState={openState}
      onOpenStateChange={setOpenState}
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
