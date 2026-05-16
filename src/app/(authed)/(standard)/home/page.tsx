import MainMenu from '../_components/MainMenu';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ホーム | Seichi Portal',
};

const Home = () => <MainMenu />;

export default Home;
