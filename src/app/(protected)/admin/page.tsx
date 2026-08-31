import type { Metadata } from 'next';

import { OPEN_STATE_TO_ANSWER_STATUSES } from '@/app/(protected)/_components/AnswersList/answerListFilters';
import type { GetParams } from '@/app/_swr/fetcher';
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

const Home = async () => {
  const { session } = await getAdminAccess();
  const [initialAnswers, forms] = await Promise.all([
    requireBackendData(
      serverApiClient.GET('/api/v1/forms/answers', {
        headers: authorizationHeader(session.token),
        // Dashboard の openState は常に 'open' から始まるため、初回表示から
        // サーバー側で絞り込んでおく。未絞り込みで返すと、クライアント側の
        // 再取得が終わるまで完了済みの回答も一瞬表示されてしまう。
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- 生成型が status[] によるサーバーサイド絞り込みにまだ追随できていないための境界調整
        params: {
          query: { status: OPEN_STATE_TO_ANSWER_STATUSES.open },
        } as unknown as GetParams<'/api/v1/forms/answers'>,
      })
    ),
    // フォーム名の突き合わせに使う参照用データのため、一覧表示とは別に全件取得する
    requireAllBackendPages((cursor) =>
      serverApiClient.GET('/api/v1/forms', {
        headers: authorizationHeader(session.token),
        params: { query: cursor === undefined ? {} : { cursor } },
      })
    ),
  ]);

  return <DataTable initialAnswers={initialAnswers} forms={forms} />;
};

export default Home;
