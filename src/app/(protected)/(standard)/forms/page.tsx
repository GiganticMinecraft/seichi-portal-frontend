import FormsPageContent from './_components/FormsPageContent';
import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { requireUser } from '@/lib/server/session';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'フォーム一覧 | Seichi Portal',
};

const Home = async () => {
  const session = await requireUser();
  const forms = await requireBackendData(
    serverApiClient.GET('/api/v1/forms', {
      headers: authorizationHeader(session.token),
    })
  );

  return <FormsPageContent forms={forms} />;
};

export default Home;
