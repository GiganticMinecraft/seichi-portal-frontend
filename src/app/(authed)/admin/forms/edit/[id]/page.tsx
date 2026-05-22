import FormEditForm from './_components/FormEditForm';
import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import ErrorDialog from '@/app/_components/ErrorDialog';
import { getAdminAccess } from '@/lib/server/session';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'フォーム編集 | Seichi Portal',
};

const Home = async ({ params }: { params: Promise<{ id: number }> }) => {
  const adminAccess = await getAdminAccess();
  if (adminAccess.state === 'forbidden') {
    return <ErrorDialog status={403} showDiagnostics={false} />;
  }
  const { session } = adminAccess;
  const { id } = await params;
  const [form, labels] = await Promise.all([
    requireBackendData(
      serverApiClient.GET('/api/v1/forms/{id}', {
        headers: authorizationHeader(session.token),
        params: {
          path: { id: String(id) },
        },
      })
    ),
    requireBackendData(
      serverApiClient.GET('/api/v1/labels/forms', {
        headers: authorizationHeader(session.token),
      })
    ),
  ]);

  return <FormEditForm form={form} labelOptions={labels} />;
};

export default Home;
