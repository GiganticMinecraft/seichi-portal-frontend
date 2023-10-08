import { getAllAnswers } from '@/api/form';
import DataTable from '@/components/dashboard';
import DashboardMenu from '@/components/dashboardMenu';
import NavBar from '@/components/NavBar';
import styles from '../page.module.css';

export default async function Home() {
  const answers = await getAllAnswers();
  return (
    <main className={styles['main']}>
      <NavBar />
      <DashboardMenu />
      <DataTable answers={answers} />
    </main>
  );
}
