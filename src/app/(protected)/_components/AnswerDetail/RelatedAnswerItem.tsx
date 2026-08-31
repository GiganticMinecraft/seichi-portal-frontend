'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  IconButton,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';

import RedactedNotice from '@/app/_components/RedactedNotice';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import { formatString } from '@/generic/DateFormatter';
import type { RelatedAnswerResponse } from '@/lib/api-types';
import { resolveAnswerTitle } from '@/lib/forms/answerTitle';

import { AnswerPublicationChip } from './AnswerMeta';
import AnswerStatusChip from './AnswerStatusChip';

const RelatedAnswerItem = ({
  relation,
  isAdmin,
  onRemove,
  divider,
}: {
  relation: RelatedAnswerResponse;
  isAdmin: boolean;
  onRemove?: (() => void) | undefined;
  divider: boolean;
}) => {
  const answerQuery = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}',
    {
      path: { form_id: relation.form_id, answer_id: relation.answer_id },
    }
  );

  const href = `${isAdmin ? '/admin' : ''}/forms/${relation.form_id}/answers/${relation.answer_id}`;
  const data = answerQuery.data;
  const label = data ? resolveAnswerTitle(data.title) : '読み込み中...';

  return (
    <ListItem
      disablePadding
      divider={divider}
      secondaryAction={
        onRemove ? (
          <IconButton
            edge="end"
            aria-label="関連付けを解除"
            onClick={() => {
              onRemove();
            }}
          >
            <DeleteIcon />
          </IconButton>
        ) : undefined
      }
    >
      <ListItemButton
        component={Link}
        href={href}
        sx={{ pr: onRemove ? 6 : 2 }}
      >
        <Stack spacing={0.5} sx={{ width: '100%', py: 0.5 }}>
          <Typography variant="body2">{label}</Typography>
          {data && (
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <AnswerStatusChip status={data.status} />
              <AnswerPublicationChip publication={data.publication} />
              {data.timestamp !== undefined ? (
                <Typography variant="caption" color="textSecondary">
                  {formatString(data.timestamp)}
                </Typography>
              ) : (
                <RedactedNotice variant="caption" />
              )}
            </Stack>
          )}
        </Stack>
      </ListItemButton>
    </ListItem>
  );
};

export default RelatedAnswerItem;
