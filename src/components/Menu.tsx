'use client';

import { Box, Button, styled, Stack, Typography } from '@mui/material';
import { Link } from './Link';

const Item = styled(Button)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary.light,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Menu = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <Link href="/forms">
          <Item as={'div'}>
            <Typography variant="h5">フォーム一覧</Typography>
          </Item>
        </Link>
        <Link href="/punishments">
          <Item as={'div'}>
            <Typography variant="h5">処罰履歴</Typography>
          </Item>
        </Link>
        <Link href="/announcements">
          <Item as={'div'}>
            <Typography variant="h5">お知らせ一覧</Typography>
          </Item>
        </Link>
      </Stack>
    </Box>
  );
};

export default Menu;
