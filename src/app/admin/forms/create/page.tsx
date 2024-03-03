import { isRight } from 'fp-ts/lib/Either';
import { redirect } from 'next/navigation';
import DashboardMenu from '@/components/DashboardMenu';
import NavBar from '@/components/NavBar';
import { CreateFormComponent } from '@/features/form/components/CreateForm';
import { getCachedToken } from '@/features/user/api/mcToken';
import { getUser } from '@/features/user/api/user';
import styles from '../../../page.module.css';

const Home = async () => {
  const token = (await getCachedToken()) ?? '';
  const user = await getUser(token);

  if (isRight(user) && user.right.role == 'STANDARD_USER') {
    redirect('/forbidden');
  }

  return (
    <main className={styles['main']}>
      <NavBar />
      <DashboardMenu />
      <CreateFormComponent token={token} />
    </main>
  );
};

export default Home;
