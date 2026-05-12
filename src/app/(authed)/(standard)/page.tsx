'use client';

import { Alert, AlertTitle } from '@mui/material';
import { DEBUG_MODE } from '@/env.client';
import { useSession } from '@/hooks/useSession';
import { usePageTitle } from '@/hooks/usePageTitle';
import MainMenu from './_components/MainMenu';
import { NeedToSignin } from './_components/NeedToSignin';
import LoadingCircular from '@/app/_components/LoadingCircular';

const HomeContent = () => {
  const { state } = useSession();

  if (state === 'loading') {
    return <LoadingCircular />;
  }

  if (state === 'error') {
    return (
      <Alert severity="error">
        <AlertTitle>ユーザー情報の取得に失敗しました</AlertTitle>
        時間を置いて再試行してください。
      </Alert>
    );
  }

  if (state === 'unauthenticated') {
    return <NeedToSignin />;
  }

  return <MainMenu />;
};

const Home = () => {
  usePageTitle('ホーム');
  const isDebugMode = process.env.NODE_ENV === 'development' && DEBUG_MODE;

  if (isDebugMode) {
    return <MainMenu />;
  } else {
    return <HomeContent />;
  }
};

export default Home;
