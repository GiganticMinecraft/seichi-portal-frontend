import type { Metadata } from 'next';

import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { getAdminAccess } from '@/lib/server/session';

import FormsPageContent from './_components/FormsPageContent';

export const metadata: Metadata = {
  title: 'フォーム管理 | Seichi Portal',
};

const Home = async (props: {
  searchParams: Promise<{ createdFormId?: string }>;
}) => {
  const { session } = await getAdminAccess();
  const [forms, archivedForms, labels, searchParams] = await Promise.all([
    requireBackendData(
      serverApiClient.GET('/api/v1/forms', {
        headers: authorizationHeader(session.token),
      })
    ),
    requireBackendData(
      serverApiClient.GET('/api/v1/archived-forms', {
        headers: authorizationHeader(session.token),
      })
    ),
    requireBackendData(
      serverApiClient.GET('/api/v1/labels/forms', {
        headers: authorizationHeader(session.token),
      })
    ),
    props.searchParams,
  ]);

  return (
    <FormsPageContent
      forms={forms.items}
      archivedForms={archivedForms.items}
      labels={labels}
      createdFormId={searchParams.createdFormId}
    />
  );
};

export default Home;
