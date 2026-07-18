'use client';

import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import {
  toSearchResultRows,
  SEARCH_RESULT_CATEGORY_COLOR,
} from '@/app/(protected)/admin/_lib/searchResultRows';
import ErrorDialog from '@/app/_components/ErrorDialog';
import { useApiQuery } from '@/app/_swr/useApiQuery';

const SearchPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setSelectedRowId(null);
  }

  const { data, isLoading, error } = useApiQuery(
    '/api/v1/search',
    query.trim() !== '' ? { query: { query } } : null
  );

  if (error) {
    return <ErrorDialog />;
  }

  const rows = data ? toSearchResultRows(data) : [];
  const selectedRow = rows.find((row) => row.id === selectedRowId) ?? undefined;

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          「{query}」の検索結果
        </Typography>
        <Chip label={`${rows.length} 件`} size="small" color="primary" />
      </Stack>

      {rows.length === 0 && !isLoading ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            該当する検索結果がありません。
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { md: '2fr 1fr' },
            gap: 2,
            alignItems: 'start',
          }}
        >
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ position: 'relative' }}
          >
            {isLoading && (
              <LinearProgress
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1,
                }}
              />
            )}
            <Table sx={{ tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                  <TableCell sx={{ width: '30%' }}>種別</TableCell>
                  <TableCell>タイトル</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    selected={row.id === selectedRowId}
                    onClick={() => {
                      setSelectedRowId(row.id);
                    }}
                    sx={{ cursor: 'pointer', '&:last-child td': { border: 0 } }}
                  >
                    <TableCell>
                      <Chip
                        label={row.category}
                        color={SEARCH_RESULT_CATEGORY_COLOR[row.category]}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.title}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Paper variant="outlined" sx={{ p: 2 }}>
            {selectedRow ? (
              <Stack spacing={2}>
                <Stack spacing={0.5}>
                  <Chip
                    label={selectedRow.category}
                    color={SEARCH_RESULT_CATEGORY_COLOR[selectedRow.category]}
                    size="small"
                    variant="outlined"
                    sx={{ alignSelf: 'flex-start' }}
                  />
                  <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                    {selectedRow.title}
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  onClick={() => {
                    router.push(selectedRow.url);
                  }}
                >
                  詳細を見る
                </Button>
              </Stack>
            ) : (
              <Typography variant="body2" color="textSecondary">
                行を選択してください
              </Typography>
            )}
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default SearchPageContent;
