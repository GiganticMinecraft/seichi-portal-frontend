'use client';

import { DataGrid } from '@mui/x-data-grid';
import { formatString } from '@/generic/DateFormatter';
import type { GetFormAnswersResponse } from '@/app/api/_schemas/ResponseSchemas';
import type { GridColDef } from '@mui/x-data-grid';

const AnswerList = (props: {
  formTitle: string;
  answers: GetFormAnswersResponse;
}) => {
  const columns: GridColDef[] = [
    { field: 'formName', headerName: 'フォーム名', width: 200 },
    { field: 'title', headerName: 'タイトル', width: 200 },
    { field: 'date', headerName: '投稿日時', width: 200 },
  ];

  return (
    <DataGrid
      rows={props.answers.map((answer) => ({
        id: answer.id,
        formName: props.formTitle,
        title: answer.title,
        date: formatString(answer.timestamp),
      }))}
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
  );
};

export default AnswerList;
