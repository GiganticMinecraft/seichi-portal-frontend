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

import type { GetFormsResponse } from '@/lib/api-types';
import {
  formatResponsePeriod,
  toResponsePeriod,
} from '@/lib/forms/responsePeriod';

import FormRowMenu from './FormRowMenu';
import LabelChips from './LabelChips';

interface Props {
  forms: GetFormsResponse;
  onFormClick: (formId: string) => void;
  onResult?: ((result: { ok: boolean }) => void) | undefined;
}

const FormsView = ({ forms, onFormClick, onResult }: Props) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>タイトル</TableCell>
            <TableCell>ラベル</TableCell>
            <TableCell>回答期間</TableCell>
            <TableCell align="right" sx={{ width: 56 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {forms.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                <Typography color="textSecondary">
                  条件に一致するフォームがありません
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            forms.map((form) => (
              <TableRow
                key={form.id}
                hover
                sx={{ cursor: 'pointer', height: 64 }}
                onClick={() => {
                  onFormClick(form.id);
                }}
              >
                <TableCell>
                  <Typography variant="body1">{form.title}</Typography>
                </TableCell>
                <TableCell>
                  <LabelChips labels={form.labels} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="textSecondary">
                    {formatResponsePeriod(
                      toResponsePeriod(
                        form.settings.answer_settings.acceptance_period
                      )
                    )}
                  </Typography>
                </TableCell>
                <TableCell
                  align="right"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  sx={{ width: 56 }}
                >
                  <FormRowMenu formId={form.id} onResult={onResult} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FormsView;
