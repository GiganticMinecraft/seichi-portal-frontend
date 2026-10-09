import type { Metadata } from 'next';

import {
  OPEN_STATE_TO_ANSWER_STATUSES,
  resolveAnswerOpenState,
} from '@/app/(protected)/_components/AnswersList/answerListFilters';
import AnswersPageContent from '@/app/(protected)/_components/AnswersList/AnswersPageContent';
import * as sdk from '@/generated/api/sdk.gen';
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
      sdk.getAnswerByFormIdHandler({
        client: serverApiClient,
        headers: authorizationHeader(session.token),
        path: { form_id: formId },
        query: { status: OPEN_STATE_TO_ANSWER_STATUSES[openState] },
      })
    ),
    requireBackendData(
      sdk.getFormHandler({
        client: serverApiClient,
        headers: authorizationHeader(session.token),
        path: { form_id: formId },
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
