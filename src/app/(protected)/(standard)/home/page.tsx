import type { Metadata } from 'next';

import MainMenu from '../_components/MainMenu';

export const metadata: Metadata = {
  title: 'ホーム | Seichi Portal',
};

const Home = async ({
  searchParams,
}: {
  searchParams: Promise<{ accessDenied?: string }>;
}) => {
  const { accessDenied } = await searchParams;
  return <MainMenu accessDenied={accessDenied} />;
};

export default Home;
