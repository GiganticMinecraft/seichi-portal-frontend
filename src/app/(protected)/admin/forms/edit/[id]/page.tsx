import type { Metadata } from 'next';

import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { getAdminAccess } from '@/lib/server/session';

import FormEditForm from './_components/FormEditForm';

export const metadata: Metadata = {
  title: 'フォーム編集 | Seichi Portal',
};

const Home = async ({ params }: { params: Promise<{ id: number }> }) => {
  const { session } = await getAdminAccess();
  const { id } = await params;
  const [form, labels, groups] = await Promise.all([
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
    requireBackendData(
      serverApiClient.GET('/api/v1/user-groups', {
        headers: authorizationHeader(session.token),
      })
    ),
  ]);

  return (
    <FormEditForm form={form} labelOptions={labels} groupOptions={groups} />
  );
};

export default Home;
