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
import { filterAnswers } from '@/app/(protected)/_components/AnswersList/answerListFilters';
import AnswerOpenStateTabs from '@/app/(protected)/_components/AnswersList/AnswerOpenStateTabs';
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

  const {
    items: answers,
    hasMore,
    isLoadingMore,
    loadMore,
  } = useInfiniteApiQuery(
    '/api/v1/forms/answers',
    (cursor) => ({ query: cursor === undefined ? {} : { cursor } }),
    props.initialAnswers
  );

  const { data: searchData, isLoading: isSearchLoading } = useApiQuery(
    '/api/v1/search/answers',
    // form_id を渡さないことで全フォーム横断検索になる
    isSearching ? { query: { query: debouncedSearch } } : null,
    { keepPreviousData: true }
  );

  const sourceAnswers = React.useMemo(
    () => (isSearching ? (searchData?.answers ?? []) : answers),
    [isSearching, searchData, answers]
  );

  const formIds = React.useMemo(
    () => formFilter.map((form) => form.id),
    [formFilter]
  );

  const dateRange = React.useMemo(
    () => ({
      startIso: startDate ? startDate.startOf('day').toISOString() : null,
      endIso: endDate ? endDate.endOf('day').toISOString() : null,
    }),
    [startDate, endDate]
  );

  // 種別・ラベル・日付範囲・未完了/完了での絞り込みはクライアントサイドで行う。openState は
  // 常に 'open' か 'closed' のいずれかで絞り込みが有効な状態にあるため、hasMore が false に
  // なるまで残りページを読み込みきる。テキスト検索中は /api/v1/search/answers が最初から
  // 全件を返すため不要。
  React.useEffect(() => {
    if (!isSearching && hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [isSearching, hasMore, isLoadingMore, loadMore]);

  const isPrefetchingForFilter = !isSearching && hasMore;

  const filteredAnswers = React.useMemo(
    () =>
      filterAnswers(
        filterAnswersByFormAndDate(sourceAnswers, { formIds, dateRange }),
        { labels: labelFilter, openState }
      ),
    [sourceAnswers, formIds, dateRange, labelFilter, openState]
  );

  const formTitleById = React.useMemo(
    () => new Map(props.forms.map((form) => [form.id, form.title])),
    [props.forms]
  );

  const rows = React.useMemo(
    () => toDashboardAnswerRows(filteredAnswers, formTitleById),
    [filteredAnswers, formTitleById]
  );

  const labelOptions = React.useMemo(() => {
    const byId = new Map<string, GetAnswerLabelsResponse[number]>();
    for (const answer of sourceAnswers) {
      for (const label of answer.labels) {
        byId.set(label.id, label);
      }
    }
    return Array.from(byId.values());
  }, [sourceAnswers]);

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
        {(isSearching && isSearchLoading) || isPrefetchingForFilter ? (
          <LinearProgress
            sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}
          />
        ) : null}
        {isPrefetchingForFilter && (
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ display: 'block', mb: 0.5 }}
          >
            絞り込みのため全件を読み込み中です。結果が確定するまでお待ちください。
          </Typography>
        )}
        <DashboardAnswersGrid
          rows={rows}
          hasMore={!isSearching && hasMore}
          isLoadingMore={!isSearching && isLoadingMore}
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
