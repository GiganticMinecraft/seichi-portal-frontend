'use client';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { formatString } from '@/generic/DateFormatter';
import type { GetAnswerResponse } from '@/lib/api-types';

import { usePaginatedRows } from './usePaginatedRows';

interface Row {
  id: string;
  category: string;
  title: string;
  date: string;
}

type AnswerResponseWithFormTitle = GetAnswerResponse & { form_title: string };

const prepareRows = (
  answerResponseWithFormTitle: AnswerResponseWithFormTitle[]
) => {
  return answerResponseWithFormTitle.map((answer) => {
    const row: Row = {
      id: answer.id,
      category: answer.form_title,
      title: answer.title ?? '',
      date: formatString(answer.timestamp),
    };
    return row;
  });
};

const DataTable = (props: {
  answerResponseWithFormTitle: AnswerResponseWithFormTitle[];
}) => {
  const router = useRouter();
  const rows = React.useMemo(
    () => prepareRows(props.answerResponseWithFormTitle),
    [props.answerResponseWithFormTitle]
  );
  const {
    page,
    paginatedRows,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
  } = usePaginatedRows(rows);

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
          {paginatedRows.map((row) => (
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
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
      />
    </TableContainer>
  );
};

export default DataTable;
