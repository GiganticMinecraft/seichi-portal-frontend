'use client';

import assert from 'assert';
import { Box, Modal, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import {
  searchAnswerItemSchema,
  searchFormItemSchema,
  searchLabelItemSchema,
  searchUserItemSchema,
} from '@/lib/api-types';
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
      data.forms.flatMap((form) => {
        const result = searchFormItemSchema.safeParse(form);
        return result.success
          ? [
              {
                category: 'フォーム' as const,
                title: result.data.title,
                url: `/admin/forms/edit/${result.data.id}`,
              },
            ]
          : [];
      }),
      data.answers.flatMap((answer) => {
        const result = searchAnswerItemSchema.safeParse(answer);
        return result.success
          ? [
              {
                category: '回答' as const,
                title: result.data.answer,
                url: `/admin/answer/${result.data.answer_id}`,
              },
            ]
          : [];
      }),
      data.users.flatMap((user) => {
        const result = searchUserItemSchema.safeParse(user);
        return result.success
          ? [
              {
                category: 'ユーザー' as const,
                title: result.data.name,
                url: `/admin/users/`,
              },
            ]
          : [];
      }),
      data.label_for_forms.flatMap((label) => {
        const result = searchLabelItemSchema.safeParse(label);
        return result.success
          ? [
              {
                category: 'フォーム用ラベル' as const,
                title: result.data.name,
                url: `/admin/labels/forms`,
              },
            ]
          : [];
      }),
      data.label_for_answers.flatMap((label) => {
        const result = searchLabelItemSchema.safeParse(label);
        return result.success
          ? [
              {
                category: '回答用ラベル' as const,
                title: result.data.name,
                url: `/admin/labels/answers`,
              },
            ]
          : [];
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
