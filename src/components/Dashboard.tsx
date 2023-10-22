'use client';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import * as React from 'react';
import type { BatchAnswer } from '@/features/form/types/formSchema';

const columns: GridColDef[] = [
  { field: 'category', headerName: '種別', width: 200 },
  { field: 'title', headerName: 'タイトル', width: 200 },
  { field: 'date', headerName: '日付', width: 130 },
];

interface Answers {
  answers: BatchAnswer[];
}

interface Row {
  id: number;
  category: string;
  title: string;
  date: string;
}

const prepareRows = (answers: Answers) => {
  return answers.answers.map((answer, index) => {
    const row: Row = {
      id: index,
      category: 'unknown category',
      title: answer.title,
      date: answer.timestamp,
    };
    return row;
  });
};

const DataTable = (answers: Answers) => {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={prepareRows(answers)}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        sx={{
          '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
            color: 'white',
          },
        }}
        checkboxSelection
      />
    </div>
  );
};

export default DataTable;
