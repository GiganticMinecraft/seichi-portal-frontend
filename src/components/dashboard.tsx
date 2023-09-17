'use client';

import { DataGrid, type GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'category', headerName: '種別', width: 200 },
  { field: 'title', headerName: 'タイトル', width: 200 },
  { field: 'date', headerName: '日付', width: 130 },
];

const rows = [
  {
    id: 1,
    category: 'お問い合わせ',
    title: 'なんやかんや',
    date: '2023-03-23',
  },
  {
    id: 2,
    category: 'お問い合わせ',
    title: 'なんやかんや',
    date: '2023-03-23',
  },
  {
    id: 3,
    category: 'お問い合わせ',
    title: 'なんやかんや',
    date: '2023-03-23',
  },
  {
    id: 4,
    category: 'お問い合わせ',
    title: 'なんやかんや',
    date: '2023-03-23',
  },
  {
    id: 5,
    category: 'お問い合わせ',
    title: 'なんやかんや',
    date: '2023-03-23',
  },
  {
    id: 6,
    category: 'お問い合わせ',
    title: 'なんやかんや',
    date: '2023-03-23',
  },
  {
    id: 7,
    category: 'お問い合わせ',
    title: 'なんやかんや',
    date: '2023-03-23',
  },
  {
    id: 8,
    category: 'お問い合わせ',
    title: 'なんやかんや',
    date: '2023-03-23',
  },
  {
    id: 9,
    category: 'お問い合わせ',
    title: 'なんやかんや',
    date: '2023-03-23',
  },
];

export default function DataTable() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
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
}
