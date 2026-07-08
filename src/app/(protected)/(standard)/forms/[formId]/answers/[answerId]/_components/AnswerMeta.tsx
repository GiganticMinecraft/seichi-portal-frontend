'use client';

import { Box, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

import { formatString } from '@/generic/DateFormatter';
import type { GetAnswerResponse } from '@/lib/api-types';

import AnswerLabels from './AnswerLabels';

type Author = GetAnswerResponse['author'];

const AuthorName = ({ author }: { author: Author }) => {
  if (author.type === 'TEMPORARY_USER') {
    return (
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Typography>{author.temporary_user.name}</Typography>
        <Chip label="未ログイン" size="small" color="default" />
        <Typography variant="caption" color="textSecondary">
          連絡先:{' '}
          <Typography component="span" variant="caption" color="textPrimary">
            {author.temporary_user.contact_text}
          </Typography>
        </Typography>
      </Stack>
    );
  }

  return <Typography>{author.user.name}</Typography>;
};

const AnswerMeta = (props: {
  answer: GetAnswerResponse;
  messageAction: ReactNode;
  labelsSlot?: ReactNode;
  extraActions?: ReactNode;
}) => (
  <Paper variant="outlined" sx={{ p: 2 }}>
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="caption" color="textSecondary">
          回答者
        </Typography>
        <AuthorName author={props.answer.author} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="caption" color="textSecondary">
          回答日時
        </Typography>
        <Typography>{formatString(props.answer.timestamp)}</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="caption" color="textSecondary">
          ラベル
        </Typography>
        <Box>{props.labelsSlot ?? <AnswerLabels answers={props.answer} />}</Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Stack
          direction="row"
          spacing={2}
          useFlexGap
          sx={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {props.extraActions}
          {props.messageAction}
        </Stack>
      </Grid>
    </Grid>
  </Paper>
);

export default AnswerMeta;
