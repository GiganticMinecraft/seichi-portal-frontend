import { Forms } from '@/components/DashboardFormList';
import DashboardMenu from '@/components/DashboardMenu';
import NavBar from '@/components/NavBar';
import { getForms } from '@/features/form/api/form';
import { getCachedToken } from '@/features/user/api/mcToken';
import styles from '../../page.module.css';

const Home = async () => {
  const token = (await getCachedToken()) ?? '';
  const forms = await getForms(token);
  return (
    <main className={styles['main']}>
      <NavBar />
      <DashboardMenu />
      <Forms forms={forms} />
    </main>
  );
};

export default Home;
