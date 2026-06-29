'use client';

import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { AnswerListRow } from '../_lib/answerListRows';
import type {
  GridColDef,
  GridEventListener,
  GridRowParams,
} from '@mui/x-data-grid';

const AnswersView = ({
  formTitle,
  rows,
  onAnswerClick,
}: {
  formTitle: string;
  rows: AnswerListRow[];
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
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        sx={{
          border: 0,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'action.hover',
          },
        }}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default AnswersView;
