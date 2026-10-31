'use client';

import {
  Box,
  Chip,
  LinearProgress,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import {
  countSearchResultRowsByCategory,
  SEARCH_RESULT_CATEGORIES,
  SEARCH_RESULT_CATEGORY_COLOR,
  toSearchResultRows,
} from '@/app/(protected)/admin/_lib/searchResultRows';
import type {
  SearchResultCategory,
  SearchResultRow,
} from '@/app/(protected)/admin/_lib/searchResultRows';
import ErrorDialog from '@/app/_components/ErrorDialog';
import { useApiQuery } from '@/app/_swr/useApiQuery';

const ROWS_PER_PAGE_OPTIONS = [25, 50, 100];
const DEFAULT_ROWS_PER_PAGE = 50;

const paginationItemLabel = (
  type: 'first' | 'last' | 'next' | 'previous'
): string => {
  switch (type) {
    case 'first':
      return '最初のページへ';
    case 'last':
      return '最後のページへ';
    case 'next':
      return '次のページへ';
    case 'previous':
      return '前のページへ';
  }
};

/**
 * 検索結果の一覧。種別の絞り込みとページングの状態を持つ。
 *
 * 結果は種別順 (フォーム → 回答 → … → コメント) に並ぶため、ページングだけだと
 * 後ろの種別にたどり着きにくい。種別ごとの件数付きのチップで絞り込めるようにする。
 * クエリが変わったら呼び出し側が `key` で作り直し、絞り込みとページを最初に戻す。
 */
const SearchResultsTable = ({
  rows,
  isLoading,
}: {
  rows: SearchResultRow[];
  isLoading: boolean;
}) => {
  const router = useRouter();
  const [selectedCategory, setCategory] = useState<SearchResultCategory | null>(
    null
  );
  const [requestedPage, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  const counts = countSearchResultRowsByCategory(rows);
  // 再取得で結果が減ることがあるので、選択中の種別とページは結果に合わせて丸める
  const category =
    selectedCategory !== null && counts[selectedCategory] > 0
      ? selectedCategory
      : null;
  const filteredRows =
    category === null ? rows : rows.filter((row) => row.category === category);
  const lastPage = Math.max(
    0,
    Math.ceil(filteredRows.length / rowsPerPage) - 1
  );
  const page = Math.min(requestedPage, lastPage);
  const pageRows = filteredRows.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const selectCategory = (next: SearchResultCategory | null) => {
    setCategory(next);
    setPage(0);
  };

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        sx={{ flexWrap: 'wrap' }}
        role="group"
        aria-label="種別で絞り込み"
      >
        <Chip
          label={`すべて (${rows.length})`}
          color="primary"
          variant={category === null ? 'filled' : 'outlined'}
          onClick={() => {
            selectCategory(null);
          }}
        />
        {SEARCH_RESULT_CATEGORIES.filter(
          (candidate) => counts[candidate] > 0
        ).map((candidate) => (
          <Chip
            key={candidate}
            label={`${candidate} (${counts[candidate]})`}
            color={SEARCH_RESULT_CATEGORY_COLOR[candidate]}
            variant={category === candidate ? 'filled' : 'outlined'}
            onClick={() => {
              selectCategory(candidate);
            }}
          />
        ))}
      </Stack>
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
            {pageRows.map((row) => (
              <TableRow
                key={row.id}
                hover
                onClick={(event) => {
                  // タイトルのリンクをクリックしたときはリンク側の遷移に任せる
                  if (
                    event.target instanceof Element &&
                    event.target.closest('a')
                  ) {
                    return;
                  }
                  router.push(row.url);
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
                  {/* a 要素にしてキーボード操作や新しいタブで開く操作を効かせる */}
                  <Link
                    component={NextLink}
                    href={row.url}
                    color="inherit"
                    underline="hover"
                  >
                    {row.title}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onPageChange={(_event, nextPage) => {
            setPage(nextPage);
          }}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value));
            setPage(0);
          }}
          labelRowsPerPage="表示件数"
          labelDisplayedRows={({ from, to, count }) =>
            `${count} 件中 ${from}–${to} 件`
          }
          getItemAriaLabel={paginationItemLabel}
        />
      </TableContainer>
    </Stack>
  );
};

const SearchPageContent = () => {
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
        <SearchResultsTable key={query} rows={rows} isLoading={isLoading} />
      )}
    </Box>
  );
};

export default SearchPageContent;
