import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'アクセス権限がありません | Seichi Portal',
};

const ForbiddenPage = () => (
  <Box
    sx={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
      <LockOutlinedIcon sx={{ fontSize: 64, color: 'warning.main' }} />
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        このページを表示する権限がありません
      </Typography>
      <Typography color="text.secondary">
        管理者アカウントでサインインしてください。
      </Typography>
      <Button variant="contained" component={Link} href="/">
        ホームへ戻る
      </Button>
    </Stack>
  </Box>
);

export default ForbiddenPage;
