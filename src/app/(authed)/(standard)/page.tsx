'use client';

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { MsalProvider } from '@/app/_components/MsalProvider';
import MainMenu from './_components/MainMenu';
import { NeedToSignin } from './_components/NeedToSignin';

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
