import type { Metadata } from 'next';

import * as sdk from '@/generated/api/sdk.gen';
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
  const [labels, groups] = await Promise.all([
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

  return <FormCreateForm labelOptions={labels} groupOptions={groups} />;
};

export default Home;
