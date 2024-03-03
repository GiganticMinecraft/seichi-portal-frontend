import DataTable from '@/components/Dashboard';
import DashboardMenu from '@/components/DashboardMenu';
import NavBar from '@/components/NavBar';
import { getAllAnswers } from '@/features/form/api/form';
import { getCachedToken } from '@/features/user/api/mcToken';
import styles from '../page.module.css';
import { isRight } from 'fp-ts/lib/Either';
import { redirect } from 'next/navigation';

const Home = async () => {
  const token = (await getCachedToken()) ?? '';
  const answers = await getAllAnswers(token);

  if (isRight(answers)) {
    return (
      <main className={styles['main']}>
        <NavBar />
        <DashboardMenu />
        <DataTable answers={answers.right} />
      </main>
    );
  } else {
    redirect('/forbidden');
  }
};

export default Home;
