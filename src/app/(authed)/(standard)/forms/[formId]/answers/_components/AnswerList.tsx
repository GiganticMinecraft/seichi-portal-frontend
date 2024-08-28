'use client';

import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import { formatString } from '@/generic/DateFormatter';
import type { GetFormAnswersResponse } from '@/app/api/_schemas/ResponseSchemas';
import type {
  GridColDef,
  GridEventListener,
  GridRowParams,
} from '@mui/x-data-grid';

const AnswerList = (props: {
  formTitle: string;
  answers: GetFormAnswersResponse;
}) => {
  const router = useRouter();

  const handleRowClick: GridEventListener<'rowClick'> = (
    params: GridRowParams
  ) => {
    router.push(`/forms/${props.answers[0]?.form_id}/answers/${params.id}`);
  };

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

export default AnswerList;
