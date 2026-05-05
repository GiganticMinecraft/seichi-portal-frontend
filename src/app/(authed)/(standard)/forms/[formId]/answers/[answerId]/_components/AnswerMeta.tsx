'use client';

import { Box, Grid, Paper, Typography } from '@mui/material';
import { formatString } from '@/generic/DateFormatter';
import AnswerLabels from './AnswerLabels';
import type { GetAnswerResponse } from '@/lib/api-types';

const AnswerMeta = (props: { answer: GetAnswerResponse }) => (
  <Paper variant="outlined" sx={{ p: 2 }}>
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="caption" color="text.secondary">
          回答者
        </Typography>
        <Typography>{props.answer.user.name}</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="caption" color="text.secondary">
          回答日時
        </Typography>
        <Typography>{formatString(props.answer.timestamp)}</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="caption" color="text.secondary">
          ラベル
        </Typography>
        <Box>
          <AnswerLabels answers={props.answer} />
        </Box>
      </Grid>
    </Grid>
  </Paper>
);

export default AnswerMeta;
