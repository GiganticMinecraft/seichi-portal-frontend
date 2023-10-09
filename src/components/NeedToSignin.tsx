import { Box, Alert, AlertTitle } from '@mui/material';

export const NeedToSignin = () => (
  <Box sx={{ width: '100%' }}>
    <Alert severity="error">
      <AlertTitle>サインインしてください</AlertTitle>
      本サイトをご利用いただくには、MinecraftIDを紐づけたMicrosoftアカウントでのサインインが必要です。
    </Alert>
  </Box>
);
