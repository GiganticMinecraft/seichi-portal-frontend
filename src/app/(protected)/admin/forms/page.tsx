import type { Metadata } from 'next';

import {
  authorizationHeader,
  requireAllBackendPages,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { getAdminAccess } from '@/lib/server/session';

import FormsPageContent from './_components/FormsList/FormsPageContent';

export const metadata: Metadata = {
  title: 'フォーム管理 | Seichi Portal',
};

const Home = async (props: {
  searchParams: Promise<{ createdFormId?: string }>;
}) => {
  const { session } = await getAdminAccess();
  // クライアントサイドのタイトル/ラベル絞り込みと組み合わせるため、無限スクロールではなく全件取得する
  const [forms, archivedForms, labels, searchParams] = await Promise.all([
    requireAllBackendPages((cursor) =>
      serverApiClient.GET('/api/v1/forms', {
        headers: authorizationHeader(session.token),
        params: { query: cursor === undefined ? {} : { cursor } },
      })
    ),
    requireAllBackendPages((cursor) =>
      serverApiClient.GET('/api/v1/archived-forms', {
        headers: authorizationHeader(session.token),
        params: { query: cursor === undefined ? {} : { cursor } },
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
      forms={forms}
      archivedForms={archivedForms}
      labels={labels}
      createdFormId={searchParams.createdFormId}
    />
  );
};

export default Home;
