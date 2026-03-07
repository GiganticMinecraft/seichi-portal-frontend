'use client';
import { Chip, Typography } from '@mui/material';
import type { GetAnswerResponse } from '@/lib/api-schema-types';

const AnswerLabels = (props: { answers: GetAnswerResponse }) => {
  if (props.answers.labels.length === 0) {
    return <Typography>ラベルが設定されていません</Typography>;
  } else {
    return props.answers.labels.map((label) => {
      return (
        <Chip
          label={label.name}
          sx={{ background: '#FFFFFF29' }}
          key={label.id}
        />
      );
    });
  }
};

export default AnswerLabels;
