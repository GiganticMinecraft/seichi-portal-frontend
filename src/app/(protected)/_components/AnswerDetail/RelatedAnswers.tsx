'use client';

import { List, Stack, Typography } from '@mui/material';

import { useRelatedAnswerActions } from '@/hooks/useRelatedAnswerActions';
import type { RelatedAnswerResponse } from '@/lib/api-types';

import AdminRelatedAnswerAdder from './AdminRelatedAnswerAdder';
import AdminRelatedAnswerUrlAdder from './AdminRelatedAnswerUrlAdder';
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
  const excludedAnswerIds = relations.map((relation) => relation.answer_id);

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle1">関連する回答</Typography>
      {isAdmin && (
        <Stack spacing={1}>
          <AdminRelatedAnswerAdder
            formId={formId}
            answerId={answerId}
            excludedAnswerIds={excludedAnswerIds}
          />
          <AdminRelatedAnswerUrlAdder
            formId={formId}
            answerId={answerId}
            excludedAnswerIds={excludedAnswerIds}
          />
        </Stack>
      )}
      {relations.length === 0 ? (
        <Typography color="textSecondary">
          関連付けられた回答はありません
        </Typography>
      ) : (
        <List
          disablePadding
          sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}
        >
          {relations.map((relation, index) => (
            <RelatedAnswerItem
              key={`${relation.form_id}:${relation.answer_id}`}
              relation={relation}
              isAdmin={isAdmin}
              divider={index < relations.length - 1}
              onRemove={
                isAdmin
                  ? () => {
                      void removeRelatedAnswer(relation.answer_id);
                    }
                  : undefined
              }
            />
          ))}
        </List>
      )}
    </Stack>
  );
};

export default RelatedAnswers;
