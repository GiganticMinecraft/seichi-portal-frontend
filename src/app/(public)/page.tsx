import { redirect } from 'next/navigation';
import { getSession } from '@/lib/server/session';
import { LandingContent } from './_components/LandingContent';

const LandingPage = async () => {
  const session = await getSession();
  if (session.state === 'authenticated') {
    redirect('/home');
  }

  return <LandingContent />;
};

export default LandingPage;
