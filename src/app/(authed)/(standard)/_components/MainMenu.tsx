'use client';

import { Box, Button, styled, Stack, Typography, Link } from '@mui/material';

const Item = styled(Button)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary.light,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const MainMenu = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <Link href="/forms" sx={{ textDecoration: 'none' }}>
          <Item as={'div'}>
            <Typography variant="h5">フォーム一覧</Typography>
          </Item>
        </Link>
        <Link href="/punishments" sx={{ textDecoration: 'none' }}>
          <Item as={'div'}>
            <Typography variant="h5">処罰履歴</Typography>
          </Item>
        </Link>
        <Link href="/announcements" sx={{ textDecoration: 'none' }}>
          <Item as={'div'}>
            <Typography variant="h5">お知らせ一覧</Typography>
          </Item>
        </Link>
      </Stack>
    </Box>
  );
};

export default MainMenu;
