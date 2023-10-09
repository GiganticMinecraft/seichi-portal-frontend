import { getAllAnswers } from '@/api/form';
import { getCachedToken } from '@/api/mcToken';
import DataTable from '@/components/dashboard';
import DashboardMenu from '@/components/dashboardMenu';
import NavBar from '@/components/NavBar';
import styles from '../page.module.css';

const Home = async () => {
  const token = getCachedToken() ?? '';
  const answers = await getAllAnswers(token);
  return (
    <main className={styles['main']}>
      <NavBar />
      <DashboardMenu />
      <DataTable answers={answers} />
    </main>
  );
};

export default Home;
