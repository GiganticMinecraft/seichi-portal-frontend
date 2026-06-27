import AnswerForm from './_components/AnswerForm';
import {
  authorizationHeader,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { getSession } from '@/lib/server/session';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'フォーム回答 | Seichi Portal',
};

const Home = async ({ params }: { params: Promise<{ formId: string }> }) => {
  const session = await getSession();
  const isAuthenticated = session.state === 'authenticated';
  const { formId } = await params;

  // ログイン時は認証ヘッダ付き、未ログイン時は匿名でフォームを取得する。
  const form = await requireBackendData(
    serverApiClient.GET('/api/v1/forms/{id}', {
      ...(isAuthenticated
        ? { headers: authorizationHeader(session.token) }
        : {}),
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
      isAuthenticated={isAuthenticated}
      allowTemporaryAnswers={form.settings.allow_temporary_answers ?? false}
    />
  );
};

export default Home;
