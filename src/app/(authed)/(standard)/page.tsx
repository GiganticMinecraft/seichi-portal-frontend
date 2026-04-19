'use client';

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { useState } from 'react';
import { MsalProvider } from '@/app/_components/MsalProvider';
import { DEBUG_MODE } from '@/env.client';
import MainMenu from './_components/MainMenu';
import { NeedToSignin } from './_components/NeedToSignin';
import LoadingCircular from '@/app/_components/LoadingCircular';

const HomeContent = () => {
  const { inProgress } = useMsal();

  if (inProgress !== InteractionStatus.None) {
    return <LoadingCircular />;
  }

  return (
    <>
      <AuthenticatedTemplate>
        <MainMenu />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <NeedToSignin />
      </UnauthenticatedTemplate>
    </>
  );
};

const Home = () => {
  const [isDebugMode] = useState(
    () => process.env.NODE_ENV === 'development' && DEBUG_MODE
  );

  if (isDebugMode) {
    return <MainMenu />;
  } else {
    return (
      <MsalProvider>
        <HomeContent />
      </MsalProvider>
    );
  }
};

export default Home;
