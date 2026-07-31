'use client';

import { Chip } from '@mui/material';
import Link from 'next/link';

import { useApiQuery } from '@/app/_swr/useApiQuery';
import type { RelatedAnswerResponse } from '@/lib/api-types';
import { resolveAnswerTitle } from '@/lib/forms/answerTitle';

const RelatedAnswerItem = ({
  relation,
  isAdmin,
}: {
  relation: RelatedAnswerResponse;
  isAdmin: boolean;
}) => {
  const answerQuery = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}',
    {
      path: { form_id: relation.form_id, answer_id: relation.answer_id },
    }
  );

  const href = `${isAdmin ? '/admin' : ''}/forms/${relation.form_id}/answers/${relation.answer_id}`;
  const label = answerQuery.data
    ? resolveAnswerTitle(answerQuery.data.title)
    : '読み込み中...';

  return (
    <Chip
      component={Link}
      href={href}
      label={label}
      clickable
      variant="outlined"
    />
  );
};

export default RelatedAnswerItem;
