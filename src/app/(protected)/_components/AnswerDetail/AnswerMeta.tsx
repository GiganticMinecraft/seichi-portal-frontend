'use client';

import { Box, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

import { formatString } from '@/generic/DateFormatter';
import type { GetAnswerResponse } from '@/lib/api-types';

import AnswerLabels from './AnswerLabels';
import AnswerStatusChip from './AnswerStatusChip';

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
        <Chip label="未サインイン" size="small" color="default" />
        <Typography variant="caption" color="textSecondary">
          連絡先:{' '}
          <Box component="span" sx={{ color: 'text.primary' }}>
            {author.temporary_user.contact_text}
          </Box>
        </Typography>
      </Stack>
    );
  }

  if (author.type === 'ANONYMOUS') {
    return <Chip label="匿名" size="small" color="default" />;
  }

  if (author.type === 'IMPORTED_FROM_REDMINE') {
    return (
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Typography>{author.redmine_user.display_name}</Typography>
        <Chip label="Redmineから移行" size="small" color="default" />
      </Stack>
    );
  }

  return <Typography>{author.user.name}</Typography>;
};

export const AnswerPublicationChip = ({
  publication,
}: {
  publication: GetAnswerResponse['publication'];
}) =>
  publication === 'PRIVATE' ? (
    <Chip label="非公開" size="small" color="warning" />
  ) : (
    <Chip label="公開" size="small" color="default" />
  );

const AnswerMeta = (props: {
  answer: GetAnswerResponse;
  messageAction: ReactNode;
  labelsSlot?: ReactNode;
  publicationSlot?: ReactNode;
  statusSlot?: ReactNode;
  statusHistoryAction?: ReactNode;
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
        <Typography variant="caption" color="textSecondary">
          この回答の公開状態
        </Typography>
        <Box>
          {props.publicationSlot ?? (
            <AnswerPublicationChip publication={props.answer.publication} />
          )}
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="caption" color="textSecondary">
          対応状況
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', flexWrap: 'wrap' }}
        >
          <Box>
            {props.statusSlot ?? (
              <AnswerStatusChip status={props.answer.status} />
            )}
          </Box>
          {props.statusHistoryAction}
        </Stack>
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
