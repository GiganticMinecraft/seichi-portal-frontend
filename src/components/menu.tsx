'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Link from 'next/link';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Menu() {
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <Link href="/forms">
          <Item>フォーム一覧</Item>
        </Link>
        <Item>処罰履歴</Item>
        <Item>お知らせ一覧</Item>
      </Stack>
    </Box>
  );
}
