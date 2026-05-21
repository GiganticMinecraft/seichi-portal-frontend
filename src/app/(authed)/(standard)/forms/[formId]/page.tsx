import AnswerForm from './_components/AnswerForm';
import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { requireUser } from '@/lib/server/session';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'フォーム回答 | Seichi Portal',
};

const Home = async ({ params }: { params: Promise<{ formId: string }> }) => {
  const session = await requireUser();
  const { formId } = await params;
  const form = await requireBackendData(
    serverApiClient.GET('/api/v1/forms/{id}', {
      headers: authorizationHeader(session.token),
      params: {
        path: { id: formId },
      },
    })
  );

  return (
    <AnswerForm
      questions={form.questions}
      formId={formId}
      title={form.title}
      description={form.description}
    />
  );
};

export default Home;
