import FormCreateForm from './_components/FormCreateForm';
import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { requireAdmin } from '@/lib/server/session';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'フォーム作成 | Seichi Portal',
};

const Home = async () => {
  const session = await requireAdmin();
  const labels = await requireBackendData(
    serverApiClient.GET('/api/v1/labels/forms', {
      headers: authorizationHeader(session.token),
    })
  );

  return <FormCreateForm labelOptions={labels} />;
};

export default Home;
