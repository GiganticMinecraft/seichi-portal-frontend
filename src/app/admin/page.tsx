import DataTable from '@/components/dashboard';
import DashboardMenu from '@/components/dashboardMenu';
import NavBar from '@/components/NavBar';
import styles from '../page.module.css';

export default async function Home() {
  return (
    <main className={styles['main']}>
      <NavBar />
      <DashboardMenu />
      <DataTable />
    </main>
  );
}
