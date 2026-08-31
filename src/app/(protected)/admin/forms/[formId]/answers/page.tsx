import type { Metadata } from 'next';

import {
  OPEN_STATE_TO_ANSWER_STATUSES,
  resolveAnswerOpenState,
} from '@/app/(protected)/_components/AnswersList/answerListFilters';
import AnswersPageContent from '@/app/(protected)/_components/AnswersList/AnswersPageContent';
import type { GetParams } from '@/app/_swr/fetcher';
import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { getAdminAccess } from '@/lib/server/session';

export const metadata: Metadata = {
  title: '回答一覧 | Seichi Portal',
};

const Home = async ({
  params,
  searchParams,
}: {
  params: Promise<{ formId: string }>;
  searchParams: Promise<{ status?: string }>;
}) => {
  const { session } = await getAdminAccess();
  const [{ formId }, { status }] = await Promise.all([params, searchParams]);
  const openState = resolveAnswerOpenState(status);
  const [initialAnswers, form] = await Promise.all([
    requireBackendData(
      serverApiClient.GET('/api/v1/forms/{form_id}/answers', {
        headers: authorizationHeader(session.token),
        // クライアント側の初回表示は openState をこの URL と同じ値から始めるため、
        // 初回表示から一致するようサーバー側で絞り込んでおく。
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- 生成型が status[] によるサーバーサイド絞り込みにまだ追随できていないための境界調整
        params: {
          path: { form_id: formId },
          query: { status: OPEN_STATE_TO_ANSWER_STATUSES[openState] },
        } as unknown as GetParams<'/api/v1/forms/{form_id}/answers'>,
      })
    ),
    requireBackendData(
      serverApiClient.GET('/api/v1/forms/{form_id}', {
        headers: authorizationHeader(session.token),
        params: {
          path: { form_id: formId },
        },
      })
    ),
  ]);

  return (
    <AnswersPageContent
      form={form}
      initialAnswers={initialAnswers}
      answersBasePath={`/admin/forms/${formId}/answers`}
    />
  );
};

export default Home;
