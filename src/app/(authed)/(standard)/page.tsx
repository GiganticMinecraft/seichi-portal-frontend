'use client';

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { useState } from 'react';
import { MsalProvider } from '@/app/_components/MsalProvider';
import { DEBUG_MODE } from '@/env';
import MainMenu from './_components/MainMenu';
import { NeedToSignin } from './_components/NeedToSignin';

const Home = () => {
  const [isDebugMode] = useState(
    () => process.env.NODE_ENV === 'development' && DEBUG_MODE
  );

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
