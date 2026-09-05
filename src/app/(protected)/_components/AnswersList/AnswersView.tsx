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
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import type {
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
  GridRowParams,
} from '@mui/x-data-grid';
import * as React from 'react';

import RedactedNotice from '@/app/_components/RedactedNotice';
import type { GetAnswerLabelsResponse } from '@/lib/api-types';
import type { AnswerOpenState } from '@/lib/forms/answerStatus';

import AnswerStatusChip from '../AnswerDetail/AnswerStatusChip';

import AnswerLabelFilter from './AnswerLabelFilter';
import { getAnswerListEmptyMessage } from './answerListFilters';
import type { AnswerListRow } from './answerListRows';
import AnswerOpenStateTabs from './AnswerOpenStateTabs';
import {
  useAnswerRowHighlightAndScroll,
  useInfiniteScrollTrigger,
} from './useAnswerGridInteractions';

const columns: GridColDef<AnswerListRow>[] = [
  { field: 'title', headerName: 'タイトル', minWidth: 240, flex: 1.5 },
  {
    field: 'date',
    headerName: '投稿日時',
    minWidth: 200,
    flex: 0.8,
    renderCell: (
      params: GridRenderCellParams<AnswerListRow, AnswerListRow['date']>
    ) => params.value ?? <RedactedNotice />,
  },
  {
    field: 'status',
    headerName: '対応状況',
    minWidth: 120,
    flex: 0.6,
    sortable: false,
    renderCell: (
      params: GridRenderCellParams<AnswerListRow, AnswerListRow['status']>
    ) => <AnswerStatusChip status={params.value} />,
  },
  {
    field: 'labels',
    headerName: 'ラベル',
    minWidth: 200,
    flex: 1,
    sortable: false,
    renderCell: (
      params: GridRenderCellParams<AnswerListRow, AnswerListRow['labels']>
    ) =>
      params.value === undefined ? (
        <RedactedNotice />
      ) : (
        <Stack
          direction="row"
          spacing={0.5}
          useFlexGap
          sx={{ flexWrap: 'wrap', py: 0.75 }}
        >
          {params.value.map((label) => (
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
  labelOptions,
  labelIds,
  onLabelIdsChange,
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
  labelOptions: GetAnswerLabelsResponse;
  labelIds: string[];
  onLabelIdsChange: (labelIds: string[]) => void;
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

  const { registerRowView, isRowHighlighted } = useAnswerRowHighlightAndScroll({
    apiRef,
    rowCount: rows.length,
    scrollRestorationKey,
  });

  useInfiniteScrollTrigger({ apiRef, hasMore, onLoadMore });

  const handleRowClick: GridEventListener<'rowClick'> = (
    params: GridRowParams
  ) => {
    const id = String(params.id);
    registerRowView(id);
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
      // 検索リクエストが確定するまでは rows が一時的に空になるため、確定前に
      // 「見つかりませんでした」を出さないよう空欄にする
      noRowsOverlay: () =>
        isSearchLoading ? null : (
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
    [isLoadingMore, isSearchLoading, noRowsMessage]
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
            selectedLabelIds={labelIds}
            onChange={onLabelIdsChange}
          />
        </Stack>
      </Box>
      <AnswerOpenStateTabs value={openState} onChange={onOpenStateChange} />
      <Box sx={{ position: 'relative' }}>
        {isSearchLoading && (
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
            isRowHighlighted(params.id) ? 'answer-row-last-viewed' : ''
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
