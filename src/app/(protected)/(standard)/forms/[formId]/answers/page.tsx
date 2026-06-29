import AnswersPageContent from './_components/AnswersPageContent';
import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { requireUser } from '@/lib/server/session';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '回答一覧 | Seichi Portal',
};

const Home = async ({ params }: { params: Promise<{ formId: string }> }) => {
  const session = await requireUser();
  const { formId } = await params;
  const [answers, form] = await Promise.all([
    requireBackendData(
      serverApiClient.GET('/api/v1/forms/{id}/answers', {
        headers: authorizationHeader(session.token),
        params: {
          path: { id: formId },
        },
      })
    ),
    requireBackendData(
      serverApiClient.GET('/api/v1/forms/{id}', {
        headers: authorizationHeader(session.token),
        params: {
          path: { id: formId },
        },
      })
    ),
  ]);

  return <AnswersPageContent form={form} answers={answers} />;
};

export default Home;
