'use client';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';

import type { GetArchivedFormsResponse } from '@/lib/api-types';

import ArchivedFormRowMenu from './ArchivedFormRowMenu';
import LabelChips from './LabelChips';

interface Props {
  forms: GetArchivedFormsResponse;
  onResult?: ((result: { ok: boolean }) => void) | undefined;
}

const ArchivedFormsView = ({ forms, onResult }: Props) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>タイトル</TableCell>
            <TableCell>ラベル</TableCell>
            <TableCell>アーカイブ日</TableCell>
            <TableCell align="right" sx={{ width: 56 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {forms.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                <Typography color="textSecondary">
                  アーカイブ済みのフォームはありません
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            forms.map((form) => (
              <TableRow key={form.id} sx={{ height: 64 }}>
                <TableCell>
                  <Typography variant="body1">{form.title}</Typography>
                </TableCell>
                <TableCell>
                  <LabelChips labels={form.labels} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="textSecondary">
                    {dayjs(form.archived_at).format('YYYY/MM/DD')}
                  </Typography>
                </TableCell>
                <TableCell
                  align="right"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  sx={{ width: 56 }}
                >
                  <ArchivedFormRowMenu formId={form.id} onResult={onResult} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ArchivedFormsView;
