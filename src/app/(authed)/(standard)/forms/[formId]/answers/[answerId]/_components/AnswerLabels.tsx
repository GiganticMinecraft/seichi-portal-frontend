'use client';
import { Chip, Stack, Typography } from '@mui/material';
import type { GetAnswerResponse } from '@/lib/api-types';

const AnswerLabels = (props: { answers: GetAnswerResponse }) => {
  if (props.answers.labels.length === 0) {
    return (
      <Typography color="text.secondary">ラベルが設定されていません</Typography>
    );
  }

  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      {props.answers.labels.map((label) => (
        <Chip
          label={label.name}
          key={label.id}
          size="small"
          variant="outlined"
        />
      ))}
    </Stack>
  );
};

export default AnswerLabels;
