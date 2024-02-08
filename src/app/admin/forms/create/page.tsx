import DashboardMenu from '@/components/DashboardMenu';
import NavBar from '@/components/NavBar';
import { CreateFormComponent } from '@/features/form/components/CreateForm';
import { getCachedToken } from '@/features/user/api/mcToken';
import styles from '../../../page.module.css';

const Home = async () => {
  const token = (await getCachedToken()) ?? '';
  return (
    <main className={styles['main']}>
      <NavBar />
      <DashboardMenu />
      <CreateFormComponent />
    </main>
  );
};

export default Home;
