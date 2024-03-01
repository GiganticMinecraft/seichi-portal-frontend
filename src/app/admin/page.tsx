import DataTable from '@/components/Dashboard';
import DashboardMenu from '@/components/DashboardMenu';
import NavBar from '@/components/NavBar';
import { getAllAnswers } from '@/features/form/api/form';
import { getCachedToken } from '@/features/user/api/mcToken';
import styles from '../page.module.css';
import { noticeError } from '../error/NoticeError';
import { isRight } from 'fp-ts/lib/Either';

const Home = async () => {
  const token = (await getCachedToken()) ?? '';
  const answers = await getAllAnswers(token);

  noticeError(answers);

  if (isRight(answers)) {
    return (
      <main className={styles['main']}>
        <NavBar />
        <DashboardMenu />
        <DataTable answers={answers.right} />
      </main>
    );
  } else {
    return <></>;
  }
};

export default Home;
