import { isRight } from 'fp-ts/lib/Either';
import { redirect } from 'next/navigation';
import { redirectOrDoNothing } from '@/app/error/RedirectByErrorResponse';
import styles from '@/app/page.module.css';
import DashboardMenu from '@/components/DashboardMenu';
import NavBar from '@/components/NavBar';
import { getForm } from '@/features/form/api/form';
import { EditFormComponent } from '@/features/form/components/editForm';
import { getCachedToken } from '@/features/user/api/mcToken';
import { getUser } from '@/features/user/api/user';

const Home = async ({ params }: { params: { id: number } }) => {
  const token = (await getCachedToken()) ?? '';
  const form = await getForm(params.id, token);
  const user = await getUser(token);

  if (isRight(user) && user.right.role == 'STANDARD_USER') {
    redirect('/forbidden');
  }

  if (isRight(form)) {
    return (
      <main className={styles['main']}>
        <NavBar />
        <DashboardMenu />
        <EditFormComponent form={form.right} />
      </main>
    );
  } else {
    redirectOrDoNothing(form);
    return <></>;
  }
};

export default Home;
