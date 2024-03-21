'use client';

import { redirect } from 'next/navigation';
import DashboardMenu from '@/components/DashboardMenu';
import {
  CreateFormButton,
  Forms,
} from '@/features/form/components/DashboardFormList';
import useSWR from 'swr';
import { MinimumForm } from '@/features/form/types/formSchema';

const Home = () => {
  //memo: 認証周りをどうするか考える(場合によっては認証周りをページ内にして、callbackできるようにしたい)

  // const token = (await getCachedToken()) ?? '';
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: forms, isLoading } = useSWR<MinimumForm[]>(
    'http://localhost:3000/api/forms',
    fetcher
  );

  if (!isLoading && !forms) {
    redirect('/');
  } else if (!forms) {
    return null;
  }
  // const user = await getUser(token);

  // if (isRight(user) && user.right.role == 'STANDARD_USER') {
  //   redirect('/forbidden');
  // }

  return (
    <>
      <DashboardMenu />
      <CreateFormButton />
      <Forms forms={forms} />
    </>
  );
};

export default Home;
