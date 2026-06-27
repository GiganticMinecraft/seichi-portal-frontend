'use client';

import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Alert, AlertTitle, Button, Link, Stack } from '@mui/material';
import NextLink from 'next/link';

type Props = {
  onReset: () => void;
};

/**
 * 回答送信完了後の共通 success surface。
 */
const AnswerSubmissionSuccess = ({ onReset }: Props) => (
  <Stack
    spacing={2}
    sx={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}
  >
    <Alert severity="success" sx={{ width: '100%', maxWidth: 600 }}>
      <AlertTitle>Success</AlertTitle>
      回答を送信しました
    </Alert>
    <Stack
      spacing={2}
      direction="row"
      sx={{ justifyContent: 'space-between', alignItems: 'center' }}
    >
      <Button variant="contained" onClick={onReset} startIcon={<ArrowBack />}>
        別の回答をする
      </Button>
      <Link component={NextLink} href="/forms">
        <Button variant="contained" endIcon={<ArrowForward />}>
          フォーム一覧へ
        </Button>
      </Link>
    </Stack>
  </Stack>
);

export default AnswerSubmissionSuccess;
