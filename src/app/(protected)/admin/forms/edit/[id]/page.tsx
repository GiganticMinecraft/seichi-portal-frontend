import type { Metadata } from 'next';

import * as sdk from '@/generated/api/sdk.gen';
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
      sdk.getFormHandler({
        client: serverApiClient,
        headers: authorizationHeader(session.token),
        path: { form_id: String(id) },
      })
    ),
    requireBackendData(
      sdk.getLabelsForForms({
        client: serverApiClient,
        headers: authorizationHeader(session.token),
      })
    ),
    requireBackendData(
      sdk.userGroupList({
        client: serverApiClient,
        headers: authorizationHeader(session.token),
      })
    ),
  ]);

  return (
    <FormEditForm form={form} labelOptions={labels} groupOptions={groups} />
  );
};

export default Home;
