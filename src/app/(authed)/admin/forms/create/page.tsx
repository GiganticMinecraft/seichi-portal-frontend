import FormCreateForm from './_components/FormCreateForm';
import { backendFetchJson } from '@/lib/server/backend';
import { requireAdmin } from '@/lib/server/session';
import type { GetFormLabelsResponse } from '@/lib/api-types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'フォーム作成 | Seichi Portal',
};

const Home = async () => {
  const session = await requireAdmin();
  const labels = await backendFetchJson<GetFormLabelsResponse>(
    '/labels/forms',
    {
      method: 'GET',
      token: session.token,
    }
  );

  return <FormCreateForm labelOptions={labels} />;
};

export default Home;
