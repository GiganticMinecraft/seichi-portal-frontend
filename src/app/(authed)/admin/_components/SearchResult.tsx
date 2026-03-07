'use client';

import assert from 'assert';
import { Box, Modal, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import type { SearchResponse } from '@/lib/api-types';
import type {
  GridColDef,
  GridEventListener,
  GridRowParams,
} from '@mui/x-data-grid';

const SearchResult = (props: {
  searchContent: string;
  openState: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const { data, isLoading, error } = useSWR<SearchResponse>(
    encodeURI(`/api/proxy/search?query=${props.searchContent}`)
  );

  if (!data) {
    return null;
  } else if (!isLoading && error) {
    return <ErrorModal />;
  }

  const columns: GridColDef[] = [
    { field: 'category', headerName: '種別', width: 200 },
    { field: 'title', headerName: 'タイトル', width: 200 },
  ];

  interface Row {
    id: number;
    category:
      | 'フォーム'
      | '回答'
      | 'ユーザー'
      | 'フォーム用ラベル'
      | '回答用ラベル';
    title: string;
    url: string;
  }

  const prepareRows = () => {
    assert(data);

    return [
      (data.forms as { title: string; id: string }[]).map((form) => {
        return {
          category: 'フォーム',
          title: form.title,
          url: `/admin/forms/edit/${form.id}`,
        };
      }),
      (data.answers as { answer: string; answer_id: string }[]).map((answer) => {
        return {
          category: '回答',
          title: answer.answer,
          url: `/admin/answer/${answer.answer_id}`,
        };
      }),
      (data.users as { name: string }[]).map((user) => {
        return {
          category: 'ユーザー',
          title: user.name,
          url: `/admin/users/`,
        };
      }),
      (data.label_for_forms as { name: string }[]).map((label) => {
        return {
          category: 'フォーム用ラベル',
          title: label.name,
          url: `/admin/labels/forms`,
        };
      }),
      (data.label_for_answers as { name: string }[]).map((label) => {
        return {
          category: '回答用ラベル',
          title: label.name,
          url: `/admin/labels/answers`,
        };
      }),
      data.comments.map((comment) => ({
        category: 'コメント',
        title: comment.content,
        url: `/admin/answer/${comment.answer_id}`,
      })),
    ]
      .flat()
      .map((row, index) => ({ ...row, id: index }));
  };

  const handleRowClick: GridEventListener<'rowClick'> = (
    params: GridRowParams<Row>
  ) => {
    props.onClose();
    router.push(params.row.url);
  };

  return (
    <Modal open={props.openState} onClose={props.onClose}>
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'secondary',
          display: 'grid',
          gridTemplateColumns: { md: '1fr 1fr' },
          gap: 2,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Stack>
          <Typography>{props.searchContent} の検索結果</Typography>
          <DataGrid
            rows={prepareRows()}
            onRowClick={handleRowClick}
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
        </Stack>
      </Box>
    </Modal>
  );
};

export default SearchResult;
