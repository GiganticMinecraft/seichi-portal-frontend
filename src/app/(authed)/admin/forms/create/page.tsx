import FormCreateForm from './_components/FormCreateForm';
import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import ErrorDialog from '@/app/_components/ErrorDialog';
import { getAdminAccess } from '@/lib/server/session';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'フォーム作成 | Seichi Portal',
};

const Home = async () => {
  const adminAccess = await getAdminAccess();
  if (adminAccess.state === 'forbidden') {
    return <ErrorDialog status={403} showDiagnostics={false} />;
  }
  const { session } = adminAccess;
  const labels = await requireBackendData(
    serverApiClient.GET('/api/v1/labels/forms', {
      headers: authorizationHeader(session.token),
    })
  );

  return <FormCreateForm labelOptions={labels} />;
};

export default Home;
