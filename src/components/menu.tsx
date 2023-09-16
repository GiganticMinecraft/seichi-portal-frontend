'use client';

import { Button, Link } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const Item = styled(Button)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary.light,
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
          <Item as={'div'}>フォーム一覧</Item>
        </Link>
        <Link href="/punishments">
          <Item as={'div'}>処罰履歴</Item>
        </Link>
        <Link href="/announcements">
          <Item as={'div'}>お知らせ一覧</Item>
        </Link>
      </Stack>
    </Box>
  );
}
