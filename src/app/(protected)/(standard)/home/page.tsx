import type { Metadata } from 'next';

import MainMenu from '../_components/MainMenu';

export const metadata: Metadata = {
  title: 'ホーム | Seichi Portal',
};

const Home = () => <MainMenu />;

export default Home;
