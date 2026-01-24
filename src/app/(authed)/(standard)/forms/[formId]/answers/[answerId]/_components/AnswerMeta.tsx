'use client';

import { Grid, Typography } from '@mui/material';
import { formatString } from '@/generic/DateFormatter';
import AnswerLabels from './AnswerLabels';
import type { GetAnswerResponse } from '@/app/api/_schemas/ResponseSchemas';

const AnswerMeta = (props: { answer: GetAnswerResponse }) => (
  <Grid container spacing={2}>
    <Grid size={6}>
      <Typography sx={{ fontWeight: 'bold' }}>回答者</Typography>
      {props.answer.user.name}
    </Grid>
    <Grid size={6}>
      <Typography sx={{ fontWeight: 'bold' }}>回答日時</Typography>
      {formatString(props.answer.timestamp)}
    </Grid>
    <Grid size={6}>
      <Typography sx={{ fontWeight: 'bold' }}>ラベル</Typography>
      <AnswerLabels answers={props.answer} />
    </Grid>
  </Grid>
);

export default AnswerMeta;
