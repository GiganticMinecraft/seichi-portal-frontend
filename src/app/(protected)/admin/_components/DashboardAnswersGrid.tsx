'use client';

import { Box, Chip, CircularProgress, Stack } from '@mui/material';
import { DataGrid, gridClasses, useGridApiRef } from '@mui/x-data-grid';
import type {
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
  GridRowParams,
} from '@mui/x-data-grid';
import * as React from 'react';

import type { DashboardAnswerRow } from '../_lib/dashboardAnswerRows';

const SCROLL_END_THRESHOLD_PX = 200;

const columns: GridColDef<DashboardAnswerRow>[] = [
  { field: 'category', headerName: '種別', minWidth: 160, flex: 0.8 },
  { field: 'title', headerName: 'タイトル', minWidth: 240, flex: 1.5 },
  {
    field: 'labels',
    headerName: 'ラベル',
    minWidth: 200,
    flex: 1,
    sortable: false,
    renderCell: (
      params: GridRenderCellParams<
        DashboardAnswerRow,
        DashboardAnswerRow['labels']
      >
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
  { field: 'date', headerName: '日付', minWidth: 200, flex: 0.8 },
];

const DashboardAnswersGrid = ({
  rows,
  hasMore,
  isLoadingMore,
  onLoadMore,
  onRowClick,
}: {
  rows: DashboardAnswerRow[];
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onRowClick: (row: DashboardAnswerRow) => void;
}) => {
  const apiRef = useGridApiRef();

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
    params: GridRowParams<DashboardAnswerRow>
  ) => {
    onRowClick(params.row);
  };

  const slots = React.useMemo(
    () => ({
      footer: () =>
        isLoadingMore ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
            <CircularProgress size={20} />
          </Box>
        ) : null,
    }),
    [isLoadingMore]
  );

  return (
    <Box sx={{ position: 'relative' }}>
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        onRowClick={handleRowClick}
        sx={{
          border: 0,
          height: 560,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'action.hover',
          },
        }}
        disableRowSelectionOnClick
        slots={slots}
      />
    </Box>
  );
};

export default DashboardAnswersGrid;
