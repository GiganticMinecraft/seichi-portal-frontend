import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
} from '@azure/msal-react';

import { Layout } from '@/components/elements/Layout';
import { SignIn } from '@/features/user/components/SignIn';
import { SignOut } from '@/features/user/components/SignOut';

export const Signin = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Layout
      title="サインイン"
      description="このページではサインインを行います。"
    >
      <p>Hello!</p>
      {isAuthenticated ? <SignOut /> : <SignIn />}
      <AuthenticatedTemplate>
        <p>SignIn done!</p>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <p>You are not signed in! Please sign in.</p>
      </UnauthenticatedTemplate>
    </Layout>
  );
};
