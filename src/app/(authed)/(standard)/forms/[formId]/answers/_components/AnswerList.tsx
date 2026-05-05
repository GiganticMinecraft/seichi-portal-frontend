'use client';

import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import { formatString } from '@/generic/DateFormatter';
import type { GetFormAnswersResponse } from '@/lib/api-types';
import type {
  GridColDef,
  GridEventListener,
  GridRowParams,
} from '@mui/x-data-grid';

const AnswerList = (props: { answers: GetFormAnswersResponse }) => {
  const router = useRouter();

  const handleRowClick: GridEventListener<'rowClick'> = (
    params: GridRowParams
  ) => {
    router.push(`/forms/${props.answers[0]?.form_id}/answers/${params.id}`);
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'タイトル', minWidth: 240, flex: 1.5 },
    { field: 'date', headerName: '投稿日時', minWidth: 200, flex: 0.8 },
  ];

  return (
    <DataGrid
      rows={props.answers.map((answer) => ({
        id: answer.id,
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
      pageSizeOptions={[5, 10, 25, 50, 100]}
      sx={{
        border: 0,
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: 'action.hover',
        },
      }}
      disableRowSelectionOnClick
    />
  );
};

export default AnswerList;
