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
import { useRouter } from 'next/navigation';
import FormRowMenu from './FormRowMenu';
import LabelChips from './LabelChips';
import { formatString } from '@/generic/DateFormatter';
import type { GetFormsResponse } from '@/lib/api-types';

interface Props {
  forms: GetFormsResponse;
}

const formatResponsePeriod = (startAt: string | null, endAt: string | null) => {
  if (startAt != null && endAt != null) {
    return `${formatString(startAt)} ~ ${formatString(endAt)}`;
  }
  return '回答期限なし';
};

const FormsTable = ({ forms }: Props) => {
  const router = useRouter();

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
                <Typography color="text.secondary">
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
                onClick={() => router.push(`/forms/${form.id}/answers`)}
              >
                <TableCell>
                  <Typography variant="body1">{form.title}</Typography>
                </TableCell>
                <TableCell>
                  <LabelChips labels={form.labels} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatResponsePeriod(
                      form.settings.answer_settings?.acceptance_period
                        ?.start_at ?? null,
                      form.settings.answer_settings?.acceptance_period
                        ?.end_at ?? null
                    )}
                  </Typography>
                </TableCell>
                <TableCell
                  align="right"
                  onClick={(e) => e.stopPropagation()}
                  sx={{ width: 56 }}
                >
                  <FormRowMenu formId={form.id} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FormsTable;
