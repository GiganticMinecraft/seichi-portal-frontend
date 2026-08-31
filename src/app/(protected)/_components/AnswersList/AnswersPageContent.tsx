'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import type { GetParams } from '@/app/_swr/fetcher';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import { useInfiniteApiQuery } from '@/app/_swr/useInfiniteApiQuery';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import type {
  GetAnswerLabelsResponse,
  GetFormAnswersPageResponse,
  GetFormResponse,
} from '@/lib/api-types';
import type { AnswerOpenState } from '@/lib/forms/answerStatus';

import {
  filterAnswers,
  OPEN_STATE_TO_ANSWER_STATUSES,
  resolveAnswerOpenState,
} from './answerListFilters';
import { toAnswerListRows } from './answerListRows';
import AnswersView from './AnswersView';

const OPEN_STATE_QUERY_KEY = 'status';

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { search, debouncedSearch, isSearching, handleSearchChange } =
    useDebouncedSearch();
  const [labelFilter, setLabelFilter] = useState<GetAnswerLabelsResponse>([]);

  const openState: AnswerOpenState = useMemo(
    () => resolveAnswerOpenState(searchParams.get(OPEN_STATE_QUERY_KEY)),
    [searchParams]
  );

  const handleOpenStateChange = (newOpenState: AnswerOpenState) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(OPEN_STATE_QUERY_KEY, newOpenState);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const labelIds = useMemo(
    () => labelFilter.map((label) => label.id),
    [labelFilter]
  );

  // 未完了/完了・ラベルでの絞り込みはバックエンドの status/label_id パラメータで
  // 行う。全件を読み込んでからクライアント側で絞り込む従来方式は、回答数が多い
  // フォームで初回表示が重くなるため廃止した。
  const {
    items: answers,
    hasMore,
    isLoadingMore,
    loadMore,
    resetToFirstPage,
  } = useInfiniteApiQuery(
    '/api/v1/forms/{form_id}/answers',
    (cursor) =>
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- 生成型 (src/generated/api-types.ts) は status[]/label_id によるサーバーサイド絞り込みにまだ追随できていない。バックエンド自体は既に対応済みのため、境界でパラメータ形状を合わせる。
      ({
        path: { form_id: form.id },
        query: {
          ...(cursor === undefined ? {} : { cursor }),
          status: OPEN_STATE_TO_ANSWER_STATUSES[openState],
          ...(labelIds.length > 0 ? { label_id: labelIds } : {}),
        },
      }) as unknown as GetParams<'/api/v1/forms/{form_id}/answers'>,
    initialAnswers
  );

  useEffect(() => {
    resetToFirstPage();
  }, [openState, labelIds, resetToFirstPage]);

  const { data: searchData, isLoading: isSearchLoading } = useApiQuery(
    '/api/v1/search/answers',
    isSearching
      ? { query: { query: debouncedSearch, form_id: form.id } }
      : null,
    { keepPreviousData: true }
  );

  // 検索 API は status/label_id による絞り込みに未対応のため、検索結果に対して
  // だけクライアント側でも絞り込む。検索結果自体は既に絞られた小さな集合であり、
  // 全件ロードの問題は発生しない。
  const rows = toAnswerListRows(
    isSearching
      ? filterAnswers(searchData?.answers ?? [], {
          labels: labelFilter,
          openState,
        })
      : answers
  );

  const { data: labelOptions = [] } = useApiQuery(
    '/api/v1/labels/answers',
    undefined
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
      openState={openState}
      onOpenStateChange={handleOpenStateChange}
      scrollRestorationKey={`${pathname}?${searchParams.toString()}`}
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
