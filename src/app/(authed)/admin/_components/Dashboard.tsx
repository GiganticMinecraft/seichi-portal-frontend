'use client';

import { NoSsr } from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  type GridEventListener,
  type GridRowParams,
} from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { formatString } from '@/generic/DateFormatter';
import type { GetAnswerResponse } from '@/lib/api-types';

const columns: GridColDef[] = [
  { field: 'category', headerName: '種別', width: 200 },
  { field: 'title', headerName: 'タイトル', width: 200 },
  { field: 'date', headerName: '日付', width: 200 },
];

interface Row {
  id: string;
  category: string;
  title: string;
  date: string;
}

type AnswerResponseWithFormTitle = GetAnswerResponse & { form_title: string };

const prepareRows = (
  answerResponseWithFormTitle: AnswerResponseWithFormTitle[]
) => {
  return answerResponseWithFormTitle.map((answer) => {
    const row: Row = {
      id: answer.id,
      category: answer.form_title,
      title: answer.title ?? '',
      date: formatString(answer.timestamp),
    };
    return row;
  });
};

const DataTable = (props: {
  answerResponseWithFormTitle: AnswerResponseWithFormTitle[];
}) => {
  const router = useRouter();
  const rows = React.useMemo(
    () => prepareRows(props.answerResponseWithFormTitle),
    [props.answerResponseWithFormTitle]
  );

  const handleRowClick: GridEventListener<'rowClick'> = (
    params: GridRowParams
  ) => {
    router.push(`/admin/answer/${params.id}`);
  };

  return (
    <NoSsr>
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
          '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
            color: 'text.primary',
          },
        }}
        checkboxSelection
      />
    </NoSsr>
  );
};

export default DataTable;
