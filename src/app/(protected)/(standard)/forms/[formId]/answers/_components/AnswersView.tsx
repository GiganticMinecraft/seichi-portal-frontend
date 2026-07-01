'use client';

import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type {
  GridColDef,
  GridEventListener,
  GridRowParams,
} from '@mui/x-data-grid';

import InfiniteScrollSentinel from '@/app/_components/InfiniteScrollSentinel';

import type { AnswerListRow } from '../_lib/answerListRows';

const AnswersView = ({
  formTitle,
  rows,
  hasMore,
  isLoadingMore,
  sentinelRef,
  onAnswerClick,
}: {
  formTitle: string;
  rows: AnswerListRow[];
  hasMore: boolean;
  isLoadingMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  onAnswerClick: (answerId: string) => void;
}) => {
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
        rows={rows}
        columns={columns}
        onRowClick={handleRowClick}
        autoHeight
        hideFooter
        sx={{
          border: 0,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'action.hover',
          },
        }}
        disableRowSelectionOnClick
      />
      {hasMore && (
        <InfiniteScrollSentinel
          sentinelRef={sentinelRef}
          isLoadingMore={isLoadingMore}
        />
      )}
    </Box>
  );
};

export default AnswersView;
