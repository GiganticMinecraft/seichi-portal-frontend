'use client';

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { MsalProvider } from '@/features/user/components/MsalProvider';
import { NeedToSignin } from '@/features/user/components/NeedToSignin';
import MainMenu from './_components/MainMenu';

const Home = () => {
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
};

export default Home;
