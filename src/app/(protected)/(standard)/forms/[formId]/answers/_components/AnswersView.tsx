'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import { DataGrid, gridClasses, useGridApiRef } from '@mui/x-data-grid';
import type {
  GridColDef,
  GridEventListener,
  GridRowParams,
} from '@mui/x-data-grid';
import * as React from 'react';

import type { AnswerListRow } from '../_lib/answerListRows';

const SCROLL_END_THRESHOLD_PX = 200;

const AnswersView = ({
  formTitle,
  rows,
  hasMore,
  isLoadingMore,
  onLoadMore,
  onAnswerClick,
}: {
  formTitle: string;
  rows: AnswerListRow[];
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onAnswerClick: (answerId: string) => void;
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
    params: GridRowParams
  ) => {
    onAnswerClick(String(params.id));
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'タイトル', minWidth: 240, flex: 1.5 },
    { field: 'date', headerName: '投稿日時', minWidth: 200, flex: 0.8 },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
        {formTitle}
      </Typography>
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
        slots={{
          footer: () =>
            isLoadingMore ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                <CircularProgress size={20} />
              </Box>
            ) : null,
        }}
      />
    </Box>
  );
};

export default AnswersView;
