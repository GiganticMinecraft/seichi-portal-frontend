'use client';

import Close from '@mui/icons-material/Close';
import History from '@mui/icons-material/History';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { formatString } from '@/generic/DateFormatter';
import type { AnswerStatusHistoryResponseEntry } from '@/lib/api-types';
import { ANSWER_STATUS_LABEL } from '@/lib/forms/answerStatus';

import AnswerStatusChip from './AnswerStatusChip';
import { useAnswerStatusHistory } from './useAnswerStatusHistory';

const AnswerStatusHistoryContent = ({
  entries,
  isLoading,
}: {
  entries: AnswerStatusHistoryResponseEntry[];
  isLoading: boolean;
}) => {
  if (entries.length > 0) {
    return (
      <Stack divider={<Divider />} spacing={1.5}>
        {[...entries].reverse().map((entry) => (
          <Stack key={entry.id} spacing={0.5}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', flexWrap: 'wrap' }}
            >
              <AnswerStatusChip status={entry.from} />
              <Typography component="span">→</Typography>
              <AnswerStatusChip status={entry.to} />
            </Stack>
            <Typography variant="caption" component="p" color="textSecondary">
              {entry.changed_by.name} が {ANSWER_STATUS_LABEL[entry.to]} に変更
              ({formatString(entry.changed_at)})
            </Typography>
          </Stack>
        ))}
      </Stack>
    );
  }

  if (isLoading) {
    return (
      <Stack sx={{ alignItems: 'center', py: 2 }}>
        <CircularProgress size={24} />
      </Stack>
    );
  }

  return (
    <Typography
      component="p"
      color="textSecondary"
      align="center"
      sx={{ py: 2 }}
    >
      変更履歴がありません
    </Typography>
  );
};

const AnswerStatusHistoryButton = ({
  formId,
  answerId,
}: {
  formId: string;
  answerId: string;
}) => {
  const [open, setOpen] = useState(false);
  const { entries, isLoading } = useAnswerStatusHistory(formId, answerId, open);

  return (
    <>
      <Button
        size="small"
        startIcon={<History fontSize="small" />}
        onClick={() => {
          setOpen(true);
        }}
      >
        変更履歴
      </Button>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          対応状況の変更履歴
          <IconButton
            aria-label="閉じる"
            onClick={() => {
              setOpen(false);
            }}
            size="small"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '70vh' }}>
          <AnswerStatusHistoryContent entries={entries} isLoading={isLoading} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AnswerStatusHistoryButton;
