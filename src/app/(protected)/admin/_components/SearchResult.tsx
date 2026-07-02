'use client';

import { Box, Modal, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type {
  GridColDef,
  GridEventListener,
  GridRowParams,
} from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';

import {
  toSearchResultRows,
  type SearchResultRow,
} from '@/app/(protected)/admin/_lib/searchResultRows';
import ErrorDialog from '@/app/_components/ErrorDialog';
import { useApiQuery } from '@/app/_swr/useApiQuery';

const SearchResult = (props: {
  searchContent: string;
  openState: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const { data, isLoading, error } = useApiQuery('/api/v1/search', {
    query: { query: props.searchContent },
  });

  if (error) {
    return <ErrorDialog />;
  }

  if (isLoading || !data) {
    return null;
  }

  const columns: GridColDef[] = [
    { field: 'category', headerName: '種別', width: 200 },
    { field: 'title', headerName: 'タイトル', width: 200 },
  ];

  const rows = toSearchResultRows(data);

  const handleRowClick: GridEventListener<'rowClick'> = (
    params: GridRowParams<SearchResultRow>
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
          bgcolor: 'background.paper',
          boxShadow: 24,
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
            rows={rows}
            onRowClick={handleRowClick}
            columns={columns}
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
        </Stack>
      </Box>
    </Modal>
  );
};

export default SearchResult;
