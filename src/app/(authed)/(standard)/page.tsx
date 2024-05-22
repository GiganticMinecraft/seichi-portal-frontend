'use client';

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { MsalProvider } from '@/app/_components/MsalProvider';
import { DEBUG_MODE } from '@/env';
import MainMenu from './_components/MainMenu';
import { NeedToSignin } from './_components/NeedToSignin';

const Home = () => {
  const [isDebugMode, setDebugMode] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV == 'development' && DEBUG_MODE) {
      setDebugMode(true);
    }
  }, []);

  if (isDebugMode) {
    return <MainMenu />;
  } else {
    return (
      <MsalProvider>
        <AuthenticatedTemplate>
          <MainMenu />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <NeedToSignin />
        </UnauthenticatedTemplate>
      </MsalProvider>
    );
  }
};

export default Home;
