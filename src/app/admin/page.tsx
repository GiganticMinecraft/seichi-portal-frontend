import DataTable from '@/components/dashboard';
import DashboardMenu from '@/components/dashboardMenu';
import ButtonAppBar from '../../components/buttonAppBar';
import styles from '../page.module.css';

export default async function Home() {
  return (
    <main className={styles['main']}>
      <ButtonAppBar />
      <DashboardMenu />
      <DataTable />
    </main>
  );
}
