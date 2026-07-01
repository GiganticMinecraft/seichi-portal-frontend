import type { Metadata } from 'next';

import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { requireUser } from '@/lib/server/session';

import FormsPageContent from './_components/FormsPageContent';

export const metadata: Metadata = {
  title: 'フォーム一覧 | Seichi Portal',
};

const Home = async () => {
  const session = await requireUser();
  const initialForms = await requireBackendData(
    serverApiClient.GET('/api/v1/forms', {
      headers: authorizationHeader(session.token),
    })
  );

  return <FormsPageContent initialForms={initialForms} />;
};

export default Home;
