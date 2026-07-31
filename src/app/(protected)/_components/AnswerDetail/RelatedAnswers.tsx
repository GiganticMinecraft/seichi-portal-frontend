'use client';

import { Stack, Typography } from '@mui/material';

import type { RelatedAnswerResponse } from '@/lib/api-types';

import RelatedAnswerItem from './RelatedAnswerItem';

const RelatedAnswers = ({
  relations,
  isAdmin,
}: {
  relations: RelatedAnswerResponse[];
  isAdmin: boolean;
}) => (
  <Stack spacing={1}>
    <Typography variant="subtitle1">関連する回答</Typography>
    {relations.length === 0 ? (
      <Typography color="textSecondary">
        関連付けられた回答はありません
      </Typography>
    ) : (
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        {relations.map((relation) => (
          <RelatedAnswerItem
            key={`${relation.form_id}:${relation.answer_id}`}
            relation={relation}
            isAdmin={isAdmin}
          />
        ))}
      </Stack>
    )}
  </Stack>
);

export default RelatedAnswers;
