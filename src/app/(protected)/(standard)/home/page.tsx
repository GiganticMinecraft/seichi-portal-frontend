import type { Metadata } from 'next';

import MainMenu from '../_components/MainMenu';

export const metadata: Metadata = {
  title: 'ホーム | Seichi Portal',
};

const Home = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { accessDenied } = await searchParams;
  return (
    <MainMenu
      accessDenied={
        Array.isArray(accessDenied) ? accessDenied[0] : accessDenied
      }
    />
  );
};

export default Home;
