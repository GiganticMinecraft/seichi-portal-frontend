import { Box, Alert, AlertTitle } from '@mui/material';

export const NeedToSignin = () => (
  <Box sx={{ width: '100%' }}>
    <Alert severity="error">
      <AlertTitle>サインインしてください</AlertTitle>
      本サイトをご利用いただくには、MinecraftIDを紐づけたMicrosoftアカウントでのが必要です。右上のボタンよりサインインしてください。
    </Alert>
  </Box>
);
