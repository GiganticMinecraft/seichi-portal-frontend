'use client';

import { usePageTitle } from '@/hooks/usePageTitle';

const Home = () => {
  usePageTitle('不正なリクエスト');
  return <p>不正なリクエストです</p>;
};

export default Home;
