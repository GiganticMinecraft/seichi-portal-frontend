'use client';

import { Search } from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
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
  search,
  onSearchChange,
  isSearchLoading = false,
  hasMore,
  isLoadingMore,
  onLoadMore,
  onAnswerClick,
}: {
  formTitle: string;
  rows: AnswerListRow[];
  search: string;
  onSearchChange: (value: string) => void;
  isSearchLoading?: boolean;
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
        <TextField
          variant="standard"
          size="small"
          label="回答内容を検索"
          value={search}
          onChange={(e) => {
            onSearchChange(e.target.value);
          }}
          sx={{ minWidth: 240 }}
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
      </Box>
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
    </Box>
  );
};

export default AnswersView;
