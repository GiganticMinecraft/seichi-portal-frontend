'use client';

import { Stack, Typography } from '@mui/material';

import { useRelatedAnswerActions } from '@/hooks/useRelatedAnswerActions';
import type { RelatedAnswerResponse } from '@/lib/api-types';

import AdminRelatedAnswerAdder from './AdminRelatedAnswerAdder';
import RelatedAnswerItem from './RelatedAnswerItem';

const RelatedAnswers = ({
  relations,
  isAdmin,
  formId,
  answerId,
}: {
  relations: RelatedAnswerResponse[];
  isAdmin: boolean;
  formId: string;
  answerId: string;
}) => {
  const { removeRelatedAnswer } = useRelatedAnswerActions(formId, answerId);

  return (
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
              onRemove={
                isAdmin
                  ? () => {
                      void removeRelatedAnswer(relation.answer_id);
                    }
                  : undefined
              }
            />
          ))}
        </Stack>
      )}
      {isAdmin && (
        <AdminRelatedAnswerAdder
          formId={formId}
          answerId={answerId}
          excludedAnswerIds={relations.map((relation) => relation.answer_id)}
        />
      )}
    </Stack>
  );
};

export default RelatedAnswers;
