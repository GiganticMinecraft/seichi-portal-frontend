'use client';

import {
  Box,
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

  const { data, isLoading, error } = useApiQuery(
    '/api/v1/search',
    query.trim() !== '' ? { query: { query } } : null
  );

  if (error) {
    return <ErrorDialog error={error} />;
  }

  const rows = data ? toSearchResultRows(data) : [];

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
                  onClick={() => {
                    router.push(row.url);
                  }}
                  sx={{
                    cursor: 'pointer',
                    '&:last-child td': { border: 0 },
                  }}
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
      )}
    </Box>
  );
};

export default SearchPageContent;
