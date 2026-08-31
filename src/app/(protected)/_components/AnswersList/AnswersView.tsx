'use client';

import { Search } from '@mui/icons-material';
import {
  Box,
  Chip,
  CircularProgress,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, gridClasses, useGridApiRef } from '@mui/x-data-grid';
import type {
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
  GridRowParams,
} from '@mui/x-data-grid';
import * as React from 'react';
import type { Dispatch, SetStateAction } from 'react';

import type { GetAnswerLabelsResponse } from '@/lib/api-types';
import type { AnswerOpenState } from '@/lib/forms/answerStatus';

import AnswerStatusChip from '../AnswerDetail/AnswerStatusChip';

import AnswerLabelFilter from './AnswerLabelFilter';
import { getAnswerListEmptyMessage } from './answerListFilters';
import type { AnswerListRow } from './answerListRows';
import AnswerOpenStateTabs from './AnswerOpenStateTabs';

const SCROLL_END_THRESHOLD_PX = 200;

const scrollStorageKey = (key: string) => `answers-list-scroll:${key}`;
const lastViewedStorageKey = (key: string) => `answers-list-last-viewed:${key}`;

const columns: GridColDef<AnswerListRow>[] = [
  { field: 'title', headerName: 'タイトル', minWidth: 240, flex: 1.5 },
  { field: 'date', headerName: '投稿日時', minWidth: 200, flex: 0.8 },
  {
    field: 'status',
    headerName: '対応状況',
    minWidth: 120,
    flex: 0.6,
    sortable: false,
    renderCell: (
      params: GridRenderCellParams<AnswerListRow, AnswerListRow['status']>
    ) => (params.value ? <AnswerStatusChip status={params.value} /> : null),
  },
  {
    field: 'labels',
    headerName: 'ラベル',
    minWidth: 200,
    flex: 1,
    sortable: false,
    renderCell: (
      params: GridRenderCellParams<AnswerListRow, AnswerListRow['labels']>
    ) => (
      <Stack
        direction="row"
        spacing={0.5}
        useFlexGap
        sx={{ flexWrap: 'wrap', py: 0.75 }}
      >
        {params.value?.map((label) => (
          <Chip key={label.id} label={label.name} size="small" />
        ))}
      </Stack>
    ),
  },
];

const AnswersView = ({
  formTitle,
  rows,
  search,
  onSearchChange,
  isSearchLoading = false,
  isPrefetchingForFilter = false,
  labelOptions,
  onLabelFilterChange,
  openState,
  onOpenStateChange,
  hasMore,
  isLoadingMore,
  onLoadMore,
  onAnswerClick,
  scrollRestorationKey,
}: {
  formTitle: string;
  rows: AnswerListRow[];
  search: string;
  onSearchChange: (value: string) => void;
  isSearchLoading?: boolean;
  isPrefetchingForFilter?: boolean;
  labelOptions: GetAnswerLabelsResponse;
  onLabelFilterChange: Dispatch<SetStateAction<GetAnswerLabelsResponse>>;
  openState: AnswerOpenState;
  onOpenStateChange: (value: AnswerOpenState) => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onAnswerClick: (answerId: string) => void;
  /** 一覧から離脱・復帰したときにスクロール位置を復元するための識別キー */
  scrollRestorationKey: string;
}) => {
  const apiRef = useGridApiRef();
  const hasRestoredScrollRef = React.useRef(false);

  // 直前に詳細を開いた行を、一覧に戻ってきたときにハイライトする。SSR時点では
  // sessionStorage を参照できないため、useHasHydrated と同様に
  // useSyncExternalStore でハイドレーション後の値へ安全に切り替える
  const highlightedRowId = React.useSyncExternalStore(
    () => () => {},
    () =>
      window.sessionStorage.getItem(lastViewedStorageKey(scrollRestorationKey)),
    () => null
  );

  // 詳細ページからブラウザバックで戻ったときに、離脱時のスクロール位置を復元する
  React.useEffect(() => {
    if (hasRestoredScrollRef.current || rows.length === 0) return;

    const scroller = apiRef.current?.rootElementRef.current?.querySelector(
      `.${gridClasses.virtualScroller}`
    );
    if (!scroller) return;

    hasRestoredScrollRef.current = true;
    const saved = window.sessionStorage.getItem(
      scrollStorageKey(scrollRestorationKey)
    );
    if (saved !== null) {
      scroller.scrollTop = Number(saved);
    }
  }, [apiRef, rows.length, scrollRestorationKey]);

  React.useEffect(() => {
    const scroller = apiRef.current?.rootElementRef.current?.querySelector(
      `.${gridClasses.virtualScroller}`
    );
    if (!scroller) return;

    const handleScroll = () => {
      window.sessionStorage.setItem(
        scrollStorageKey(scrollRestorationKey),
        String(scroller.scrollTop)
      );
    };
    scroller.addEventListener('scroll', handleScroll);
    return () => {
      scroller.removeEventListener('scroll', handleScroll);
    };
  }, [apiRef, scrollRestorationKey]);

  // Community 版 DataGrid には onRowsScrollEnd が無いため、内部の仮想スクロールコンテナを直接監視する
  React.useEffect(() => {
    if (!hasMore) return;

    const scroller = apiRef.current?.rootElementRef.current?.querySelector(
      `.${gridClasses.virtualScroller}`
    );
    if (!scroller) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scroller;
      if (scrollHeight - scrollTop - clientHeight < SCROLL_END_THRESHOLD_PX) {
        onLoadMore();
      }
    };

    scroller.addEventListener('scroll', handleScroll);
    return () => {
      scroller.removeEventListener('scroll', handleScroll);
    };
  }, [apiRef, hasMore, onLoadMore]);

  const handleRowClick: GridEventListener<'rowClick'> = (
    params: GridRowParams
  ) => {
    const id = String(params.id);
    window.sessionStorage.setItem(
      lastViewedStorageKey(scrollRestorationKey),
      id
    );
    onAnswerClick(id);
  };

  const noRowsMessage = getAnswerListEmptyMessage({ search, openState });

  const slots = React.useMemo(
    () => ({
      footer: () =>
        isLoadingMore ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
            <CircularProgress size={20} />
          </Box>
        ) : null,
      noRowsOverlay: () => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Typography color="textSecondary">{noRowsMessage}</Typography>
        </Box>
      ),
    }),
    [isLoadingMore, noRowsMessage]
  );

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h1">
          {formTitle}
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            alignItems: { xs: 'stretch', sm: 'center' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <TextField
            variant="standard"
            size="small"
            label="回答内容を検索"
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
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
          <AnswerLabelFilter
            labelOptions={labelOptions}
            setLabelFilter={onLabelFilterChange}
          />
        </Stack>
      </Box>
      <AnswerOpenStateTabs value={openState} onChange={onOpenStateChange} />
      {isPrefetchingForFilter && (
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ display: 'block', mb: 0.5 }}
        >
          絞り込みのため全件を読み込み中です。結果が確定するまでお待ちください。
        </Typography>
      )}
      <Box sx={{ position: 'relative' }}>
        {(isSearchLoading || isPrefetchingForFilter) && (
          <LinearProgress
            sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}
          />
        )}
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          onRowClick={handleRowClick}
          getRowClassName={(params) =>
            String(params.id) === highlightedRowId
              ? 'answer-row-last-viewed'
              : ''
          }
          sx={{
            border: 0,
            height: 560,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'action.hover',
            },
            '& .answer-row-last-viewed': {
              backgroundColor: 'action.selected',
            },
          }}
          disableRowSelectionOnClick
          slots={slots}
        />
      </Box>
    </Box>
  );
};

export default AnswersView;
