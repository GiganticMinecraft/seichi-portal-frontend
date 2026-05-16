'use client';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useLandingLogin } from './useLandingLogin';

const ErrorState = ({ errorMessage }: { errorMessage: string }) => (
  <Container maxWidth="sm" sx={{ py: 10 }}>
    <Stack spacing={2}>
      <Alert severity="error">{errorMessage}</Alert>
      <Button variant="contained" onClick={() => window.location.reload()}>
        再試行
      </Button>
    </Stack>
  </Container>
);

const ProcessingState = () => (
  <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
    <CircularProgress />
  </Container>
);

type LandingViewProps = {
  onLogin: () => void;
};

const LandingView = ({ onLogin }: LandingViewProps) => (
  <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
    <Stack spacing={5} sx={{ alignItems: 'center', textAlign: 'center' }}>
      <Box>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700 }}
          gutterBottom
        >
          Seichi Portal
        </Typography>
        <Typography variant="body1" component="p" color="text.secondary">
          整地鯖（GiganticMinecraft）公式のポータルサイトです。
          <br />
          フォームへの回答や各種設定をここから行えます。
        </Typography>
      </Box>

      <Divider sx={{ width: '100%' }} />

      <Box sx={{ width: '100%' }}>
        <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
          <Typography variant="body2" component="div">
            <strong>ご利用にはMinecraftアカウントが必要です</strong>
            <br />
            整地鯖でプレイしたことのある、Minecraftアカウントに紐づいた
            Microsoftアカウントでサインインしてください。
          </Typography>
        </Alert>
        <Button
          variant="contained"
          size="large"
          onClick={onLogin}
          fullWidth
          sx={{ py: 1.5 }}
        >
          Microsoftアカウントでサインイン
        </Button>
      </Box>
    </Stack>
  </Container>
);

export const LandingContent = () => {
  const { errorMessage, isProcessing, handleLogin } = useLandingLogin();

  if (errorMessage) {
    return <ErrorState errorMessage={errorMessage} />;
  }

  // MS からのコールバック処理中（accounts が埋まり、Minecraft アクセストークン交換中）
  // のときだけスピナーを表示。初回表示や戻り遷移時はランディングそのものを即出す。
  if (isProcessing) {
    return <ProcessingState />;
  }

  return <LandingView onLogin={handleLogin} />;
};
