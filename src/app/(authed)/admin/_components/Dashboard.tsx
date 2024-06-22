'use client';

import {
  DataGrid,
  type GridColDef,
  type GridEventListener,
  type GridRowParams,
} from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { formatString } from '@/generic/DateFormatter';
import type { GetAnswersResponse } from '@/app/api/_schemas/ResponseSchemas';

const columns: GridColDef[] = [
  { field: 'category', headerName: '種別', width: 200 },
  { field: 'title', headerName: 'タイトル', width: 200 },
  { field: 'date', headerName: '日付', width: 200 },
];

interface Row {
  id: number;
  category: string;
  title: string;
  date: string;
}

type AnswerResponseWithFormTitle = GetAnswersResponse & { form_title: string };

const prepareRows = (
  answerResponseWithFormTitle: AnswerResponseWithFormTitle[]
) => {
  return answerResponseWithFormTitle.map((answer) => {
    const row: Row = {
      id: answer.id,
      category: answer.form_title,
      title: answer.title,
      date: formatString(answer.timestamp),
    };
    return row;
  });
};

const DataTable = (props: {
  answerResponseWithFormTitle: AnswerResponseWithFormTitle[];
}) => {
  const router = useRouter();

  const handleRowClick: GridEventListener<'rowClick'> = (
    params: GridRowParams
  ) => {
    router.push(`/admin/answer/${params.id}`);
  };

  return (
    <DataGrid
      rows={prepareRows(props.answerResponseWithFormTitle)}
      columns={columns}
      onRowClick={handleRowClick}
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
  );
};

export default DataTable;
