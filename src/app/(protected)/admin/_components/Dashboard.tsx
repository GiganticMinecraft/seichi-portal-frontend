'use client';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import InfiniteScrollSentinel from '@/app/_components/InfiniteScrollSentinel';
import { useInfiniteApiQuery } from '@/app/_swr/useInfiniteApiQuery';
import { formatString } from '@/generic/DateFormatter';
import type { GetAnswersPageResponse, GetFormsResponse } from '@/lib/api-types';

interface Row {
  id: string;
  category: string;
  title: string;
  date: string;
}

const DataTable = (props: {
  initialAnswers: GetAnswersPageResponse;
  forms: GetFormsResponse;
}) => {
  const router = useRouter();
  const {
    items: answers,
    hasMore,
    isLoadingMore,
    sentinelRef,
  } = useInfiniteApiQuery(
    '/api/v1/forms/answers',
    (cursor) => ({ query: cursor === undefined ? {} : { cursor } }),
    props.initialAnswers
  );

  const rows = React.useMemo<Row[]>(
    () =>
      answers.map((answer) => ({
        id: answer.id,
        category:
          props.forms.find((form) => form.id === answer.form_id)?.title ??
          'unknown form',
        title: answer.title ?? '',
        date: formatString(answer.timestamp),
      })),
    [answers, props.forms]
  );

  const handleRowClick = (rowId: string) => {
    router.push(`/admin/answer/${rowId}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>種別</TableCell>
            <TableCell>タイトル</TableCell>
            <TableCell>日付</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              hover
              onClick={() => {
                handleRowClick(row.id);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {hasMore && (
        <InfiniteScrollSentinel
          sentinelRef={sentinelRef}
          isLoadingMore={isLoadingMore}
        />
      )}
    </TableContainer>
  );
};

export default DataTable;
