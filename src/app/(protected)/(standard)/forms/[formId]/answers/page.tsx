import type { Metadata } from 'next';

import AnswersPageContent from '@/app/(protected)/_components/AnswersList/AnswersPageContent';
import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { requireUser } from '@/lib/server/session';

export const metadata: Metadata = {
  title: '回答一覧 | Seichi Portal',
};

const Home = async ({ params }: { params: Promise<{ formId: string }> }) => {
  const session = await requireUser();
  const { formId } = await params;
  const [initialAnswers, form] = await Promise.all([
    requireBackendData(
      serverApiClient.GET('/api/v1/forms/{form_id}/answers', {
        headers: authorizationHeader(session.token),
        params: {
          path: { form_id: formId },
        },
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
      answersBasePath={`/forms/${formId}/answers`}
    />
  );
};

export default Home;
