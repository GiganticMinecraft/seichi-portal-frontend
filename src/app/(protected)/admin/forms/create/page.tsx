import type { Metadata } from 'next';

import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { getAdminAccess } from '@/lib/server/session';

import FormCreateForm from './_components/FormCreateForm';

export const metadata: Metadata = {
  title: 'フォーム作成 | Seichi Portal',
};

const Home = async () => {
  const { session } = await getAdminAccess();
  const labels = await requireBackendData(
    serverApiClient.GET('/api/v1/labels/forms', {
      headers: authorizationHeader(session.token),
    })
  );

  return <FormCreateForm labelOptions={labels} />;
};

export default Home;
