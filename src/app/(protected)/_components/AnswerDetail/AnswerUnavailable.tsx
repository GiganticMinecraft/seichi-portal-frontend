'use client';

import { Button, Paper, Stack, Typography } from '@mui/material';
import NextLink from 'next/link';

import type { AnswerUnavailableReason } from '@/lib/forms/answerUnavailable';

const describeReason = (
  reason: AnswerUnavailableReason,
  archivedFormTitle: string | undefined
): string => {
  if (archivedFormTitle !== undefined) {
    return `フォーム「${archivedFormTitle}」はアーカイブされています。復元すると回答を表示できます。`;
  }
  if (reason === 'answer-not-found') {
    return 'この回答は削除されました。';
  }

  return 'この回答のフォームはアーカイブまたは削除されました。';
};

const backLinkFor = (
  isAdmin: boolean,
  hasArchivedForm: boolean
): { href: string; label: string } => {
  if (!isAdmin) {
    return { href: '/answers', label: '自分の回答一覧へ' };
  }
  if (hasArchivedForm) {
    return {
      href: '/admin/forms?tab=archived',
      label: 'アーカイブ済みフォーム一覧へ',
    };
  }

  return { href: '/admin/forms', label: 'フォーム一覧へ' };
};

/**
 * 回答詳細が開けないときの画面。
 *
 * 通知や検索結果のリンク先がアーカイブ済み・削除済みになっているケース向けで、
 * 汎用の ErrorDialog ではなく理由と戻り先を示す。管理者でアーカイブ済みフォームの
 * タイトルが分かっているときは、復元すれば開けることとアーカイブ済み一覧への導線を出す。
 */
const AnswerUnavailable = ({
  reason,
  isAdmin,
  archivedFormTitle,
}: {
  reason: AnswerUnavailableReason;
  isAdmin: boolean;
  archivedFormTitle?: string | undefined;
}) => {
  const title =
    reason === 'answer-not-found'
      ? '回答が見つかりません'
      : 'フォームが見つかりません';
  const message = describeReason(reason, archivedFormTitle);
  const backLink = backLinkFor(isAdmin, archivedFormTitle !== undefined);

  return (
    <Paper variant="outlined" sx={{ p: 4, maxWidth: 640, mx: 'auto', my: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h5" component="h1">
          {title}
        </Typography>
        <Typography color="textSecondary">{message}</Typography>
        <Button
          variant="contained"
          component={NextLink}
          href={backLink.href}
          sx={{ alignSelf: 'flex-start' }}
        >
          {backLink.label}
        </Button>
      </Stack>
    </Paper>
  );
};

export default AnswerUnavailable;
