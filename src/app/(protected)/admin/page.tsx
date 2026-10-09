import type { Metadata } from 'next';

import {
  OPEN_STATE_TO_ANSWER_STATUSES,
  resolveAnswerOpenState,
} from '@/app/(protected)/_components/AnswersList/answerListFilters';
import * as sdk from '@/generated/api/sdk.gen';
import {
  authorizationHeader,
  requireAllBackendPages,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { getAdminAccess } from '@/lib/server/session';

import DataTable from './_components/Dashboard';

export const metadata: Metadata = {
  title: '管理ダッシュボード | Seichi Portal',
};

const Home = async ({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) => {
  const { session } = await getAdminAccess();
  const { status } = await searchParams;
  const openState = resolveAnswerOpenState(status);
  const [initialAnswers, forms] = await Promise.all([
    requireBackendData(
      sdk.getAllAnswers({
        client: serverApiClient,
        headers: authorizationHeader(session.token),
        query: { status: OPEN_STATE_TO_ANSWER_STATUSES[openState] },
      })
    ),
    // フォーム名の突き合わせに使う参照用データのため、一覧表示とは別に全件取得する
    requireAllBackendPages((cursor) =>
      sdk.formListHandler({
        client: serverApiClient,
        headers: authorizationHeader(session.token),
        query: cursor === undefined ? {} : { cursor },
      })
    ),
  ]);

  return <DataTable initialAnswers={initialAnswers} forms={forms} />;
};

export default Home;
