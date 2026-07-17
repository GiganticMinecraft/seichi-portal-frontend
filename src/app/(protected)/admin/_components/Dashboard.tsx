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
import { resolveAnswerTitle } from '@/lib/forms/answerTitle';

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

  const formTitleById = React.useMemo(
    () => new Map(props.forms.map((form) => [form.id, form.title])),
    [props.forms]
  );

  const rows = React.useMemo<Row[]>(
    () =>
      answers.map((answer) => ({
        id: answer.id,
        category: formTitleById.get(answer.form_id) ?? 'unknown form',
        title: resolveAnswerTitle(answer.title),
        date: formatString(answer.timestamp),
      })),
    [answers, formTitleById]
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
