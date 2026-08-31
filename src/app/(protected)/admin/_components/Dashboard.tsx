'use client';

import { Search } from '@mui/icons-material';
import {
  Box,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import AnswerLabelFilter from '@/app/(protected)/_components/AnswersList/AnswerLabelFilter';
import {
  filterAnswers,
  OPEN_STATE_TO_ANSWER_STATUSES,
} from '@/app/(protected)/_components/AnswersList/answerListFilters';
import AnswerOpenStateTabs from '@/app/(protected)/_components/AnswersList/AnswerOpenStateTabs';
import type { GetParams } from '@/app/_swr/fetcher';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import { useInfiniteApiQuery } from '@/app/_swr/useInfiniteApiQuery';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import type {
  GetAnswerLabelsResponse,
  GetAnswersPageResponse,
  GetFormsResponse,
} from '@/lib/api-types';
import type { AnswerOpenState } from '@/lib/forms/answerStatus';

import { filterAnswersByFormAndDate } from '../_lib/dashboardAnswerFilters';
import { toDashboardAnswerRows } from '../_lib/dashboardAnswerRows';
import type { DashboardAnswerRow } from '../_lib/dashboardAnswerRows';

import DashboardAnswersGrid from './DashboardAnswersGrid';
import DashboardDateRangeFilter from './DashboardDateRangeFilter';
import DashboardFormFilter from './DashboardFormFilter';

const DataTable = (props: {
  initialAnswers: GetAnswersPageResponse;
  forms: GetFormsResponse;
}) => {
  const router = useRouter();

  const { search, debouncedSearch, isSearching, handleSearchChange } =
    useDebouncedSearch();
  const [formFilter, setFormFilter] = React.useState<GetFormsResponse>([]);
  const [labelFilter, setLabelFilter] = React.useState<GetAnswerLabelsResponse>(
    []
  );
  const [openState, setOpenState] = React.useState<AnswerOpenState>('open');
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);

  const formIds = React.useMemo(
    () => formFilter.map((form) => form.id),
    [formFilter]
  );

  const labelIds = React.useMemo(
    () => labelFilter.map((label) => label.id),
    [labelFilter]
  );

  const dateRange = React.useMemo(
    () => ({
      startIso: startDate ? startDate.startOf('day').toISOString() : null,
      endIso: endDate ? endDate.endOf('day').toISOString() : null,
    }),
    [startDate, endDate]
  );

  // 種別・ラベル・日付範囲・未完了/完了での絞り込みはバックエンドの
  // status/label_id/form_id/created_after/created_before パラメータで行う。
  // 全件を読み込んでからクライアント側で絞り込む従来方式は、全フォーム横断の
  // 回答一覧という性質上とりわけ重くなるため廃止した。
  const {
    items: answers,
    hasMore,
    isLoadingMore,
    loadMore,
    resetToFirstPage,
  } = useInfiniteApiQuery(
    '/api/v1/forms/answers',
    (cursor) =>
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- 生成型 (src/generated/api-types.ts) は status[]/label_id/form_id/created_after/created_before によるサーバーサイド絞り込みにまだ追随できていない。バックエンド自体は既に対応済みのため、境界でパラメータ形状を合わせる。
      ({
        query: {
          ...(cursor === undefined ? {} : { cursor }),
          status: OPEN_STATE_TO_ANSWER_STATUSES[openState],
          ...(labelIds.length > 0 ? { label_id: labelIds } : {}),
          ...(formIds.length > 0 ? { form_id: formIds } : {}),
          ...(dateRange.startIso !== null
            ? { created_after: dateRange.startIso }
            : {}),
          ...(dateRange.endIso !== null
            ? { created_before: dateRange.endIso }
            : {}),
        },
      }) as unknown as GetParams<'/api/v1/forms/answers'>,
    props.initialAnswers
  );

  React.useEffect(() => {
    resetToFirstPage();
  }, [openState, labelIds, formIds, dateRange, resetToFirstPage]);

  const { data: searchData, isLoading: isSearchLoading } = useApiQuery(
    '/api/v1/search/answers',
    // form_id を渡さないことで全フォーム横断検索になる
    isSearching ? { query: { query: debouncedSearch } } : null,
    { keepPreviousData: true }
  );

  // 検索 API は種別・ラベル・日付範囲による絞り込みに未対応のため、検索結果に
  // 対してだけクライアント側でも絞り込む。検索結果自体は既に絞られた小さな
  // 集合であり、全件ロードの問題は発生しない。
  const filteredAnswers = React.useMemo(
    () =>
      isSearching
        ? filterAnswers(
            filterAnswersByFormAndDate(searchData?.answers ?? [], {
              formIds,
              dateRange,
            }),
            { labels: labelFilter, openState }
          )
        : answers,
    [
      isSearching,
      searchData,
      answers,
      formIds,
      dateRange,
      labelFilter,
      openState,
    ]
  );

  const formTitleById = React.useMemo(
    () => new Map(props.forms.map((form) => [form.id, form.title])),
    [props.forms]
  );

  const rows = React.useMemo(
    () => toDashboardAnswerRows(filteredAnswers, formTitleById),
    [filteredAnswers, formTitleById]
  );

  const { data: labelOptions = [] } = useApiQuery(
    '/api/v1/labels/answers',
    undefined
  );

  const handleRowClick = (row: DashboardAnswerRow) => {
    router.push(`/admin/forms/${row.formId}/answers/${row.id}`);
  };

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Stack spacing={1.5} sx={{ mb: 2 }}>
        <Typography variant="h5" component="h1">
          回答一覧
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}
        >
          <TextField
            variant="standard"
            size="small"
            label="タイトルを検索"
            value={search}
            onChange={(e) => {
              handleSearchChange(e.target.value);
            }}
            sx={{
              minWidth: { xs: 0, sm: 240 },
              width: { xs: '100%', sm: 'auto' },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <DashboardFormFilter
            formOptions={props.forms}
            setFormFilter={setFormFilter}
          />
          <AnswerLabelFilter
            labelOptions={labelOptions}
            setLabelFilter={setLabelFilter}
          />
          <DashboardDateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </Stack>
        <AnswerOpenStateTabs value={openState} onChange={setOpenState} />
      </Stack>
      <Box sx={{ position: 'relative' }}>
        {isSearching && isSearchLoading ? (
          <LinearProgress
            sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}
          />
        ) : null}
        <DashboardAnswersGrid
          rows={rows}
          hasMore={!isSearching && hasMore}
          isLoadingMore={!isSearching && isLoadingMore}
          isSearchLoading={isSearching && isSearchLoading}
          onLoadMore={loadMore}
          onRowClick={handleRowClick}
          search={search}
          openState={openState}
        />
      </Box>
    </Box>
  );
};

export default DataTable;
