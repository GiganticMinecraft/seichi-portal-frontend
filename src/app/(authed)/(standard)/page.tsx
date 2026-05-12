'use client';

import { usePageTitle } from '@/hooks/usePageTitle';
import MainMenu from './_components/MainMenu';

const Home = () => {
  usePageTitle('ホーム');

  return <MainMenu />;
};

export default Home;
