import { isRight } from 'fp-ts/lib/Either';
import { redirect } from 'next/navigation';
import DataTable from '@/components/Dashboard';
import DashboardMenu from '@/components/DashboardMenu';
import NavBar from '@/components/NavBar';
import { getAllAnswers } from '@/features/form/api/form';
import { getCachedToken } from '@/features/user/api/mcToken';
import { getUser } from '@/features/user/api/user';
import { redirectOrDoNothing } from '../error/RedirectByErrorResponse';
import styles from '../page.module.css';

const Home = async () => {
  const token = (await getCachedToken()) ?? '';
  const answers = await getAllAnswers(token);
  const user = await getUser(token);

  if (isRight(user) && user.right.role == 'STANDARD_USER') {
    redirect('/forbidden');
  }

  if (isRight(answers)) {
    return (
      <main className={styles['main']}>
        <NavBar />
        <DashboardMenu />
        <DataTable answers={answers.right} />
      </main>
    );
  } else {
    redirectOrDoNothing(answers);
    return <></>;
  }
};

export default Home;
