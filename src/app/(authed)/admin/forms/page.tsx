import FormsPageContent from './_components/FormsPageContent';
import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { requireAdmin } from '@/lib/server/session';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'フォーム管理 | Seichi Portal',
};

const Home = async () => {
  const session = await requireAdmin();
  const [forms, labels] = await Promise.all([
    requireBackendData(
      serverApiClient.GET('/api/v1/forms', {
        headers: authorizationHeader(session.token),
      })
    ),
    requireBackendData(
      serverApiClient.GET('/api/v1/labels/forms', {
        headers: authorizationHeader(session.token),
      })
    ),
  ]);

  return <FormsPageContent forms={forms} labels={labels} />;
};

export default Home;
