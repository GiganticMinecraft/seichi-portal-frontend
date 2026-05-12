'use client';

import * as React from 'react';

const DEFAULT_ROWS_PER_PAGE = 5;

export const usePaginatedRows = <TRow>(rows: TRow[]) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);

  const paginatedRows = React.useMemo(
    () => rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
    [page, rows, rowsPerPage]
  );

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    nextPage: number
  ) => {
    setPage(nextPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  return {
    page,
    paginatedRows,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
  };
};
