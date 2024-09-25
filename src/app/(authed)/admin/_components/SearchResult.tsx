'use client';

import assert from 'assert';
import { Box, Modal, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import type {
  ErrorResponse,
  SearchResponse,
} from '@/app/api/_schemas/ResponseSchemas';
import type {
  GridColDef,
  GridEventListener,
  GridRowParams,
} from '@mui/x-data-grid';
import type { Either } from 'fp-ts/lib/Either';

const SearchResult = (props: {
  searchContent: string;
  openState: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const { data, isLoading } = useSWR<Either<ErrorResponse, SearchResponse>>(
    encodeURI(`/api/search?query=${props.searchContent}`)
  );

  if (!data) {
    return null;
  } else if (!isLoading && data._tag === 'Left') {
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

  // NOTE: `data` が Right であることを保証してから呼び出さなければならない。
  const prepareRows = () => {
    assert(data._tag === 'Right');

    return [
      data.right.forms.map((form) => {
        return {
          category: 'フォーム',
          title: form.title,
          url: `/admin/forms/edit/${form.id}`,
        };
      }),
      data.right.answers.map((answer) => {
        return {
          category: '回答',
          title: answer.answer,
          url: `/admin/answer/${answer.answer_id}`,
        };
      }),
      data.right.users.map((user) => {
        return {
          category: 'ユーザー',
          title: user.name,
          url: `/admin/users/`,
        };
      }),
      data.right.label_for_forms.map((label) => {
        return {
          category: 'フォーム用ラベル',
          title: label.name,
          url: `/admin/labels/forms`,
        };
      }),
      data.right.label_for_answers.map((label) => {
        return {
          category: '回答用ラベル',
          title: label.name,
          url: `/admin/labels/answers`,
        };
      }),
      data.right.comments.map((comment) => ({
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
