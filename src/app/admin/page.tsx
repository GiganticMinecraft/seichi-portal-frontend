import DashboardMenu from '@/components/dashboardMenu';
import ButtonAppBar from '../../components/buttonAppBar';
import styles from '../page.module.css';
import DataTable from '@/components/dashboard';

export default async function Home() {
  return (
    <main className={styles['main']}>
      <ButtonAppBar />
      <DashboardMenu />
      <DataTable />
    </main>
  );
}
