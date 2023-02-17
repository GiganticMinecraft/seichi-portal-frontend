import { Layout } from '@/components/elements/Layout';
import { SignIn } from '@/features/user/components/SignIn';
import { SignOut } from '@/features/user/components/SignOut';
import { useMcProfile } from '@/features/user/hooks';

export const Signin = () => {
  // TODO: MSアカウントにログインしているかどうかとGameProfileが格納されているかどうかの両方を考慮しきれているか？
  const profile = useMcProfile();
  const isAuthenticated = !!profile;

  return (
    <Layout
      title="サインイン"
      description="このページではサインインを行います。"
    >
      {isAuthenticated ? <SignOut /> : <SignIn />}
      {isAuthenticated ? (
        <p>
          {profile.name} {profile.id}
        </p>
      ) : (
        <p>You are not signed in! Please sign in.</p>
      )}
    </Layout>
  );
};
