import type { Metadata } from 'next';

import * as sdk from '@/generated/api/sdk.gen';
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
      sdk.formListHandler({
        client: serverApiClient,
        headers: authorizationHeader(session.token),
        query: cursor === undefined ? {} : { cursor },
      })
    ),
    requireAllBackendPages((cursor) =>
      sdk.archivedFormListHandler({
        client: serverApiClient,
        headers: authorizationHeader(session.token),
        query: cursor === undefined ? {} : { cursor },
      })
    ),
    requireBackendData(
      sdk.getLabelsForForms({
        client: serverApiClient,
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
