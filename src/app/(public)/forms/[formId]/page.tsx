import type { Metadata } from 'next';

import {
  authorizationHeader,
  BackendError,
  requireBackendData,
  serverApiClient,
} from '@/lib/server/backend';
import { getSession } from '@/lib/server/session';

import AnswerForm from './_components/AnswerForm';
import { toActiveSubmissionRestriction } from './_lib/submissionErrors';

export const metadata: Metadata = {
  title: 'フォーム回答 | Seichi Portal',
};

// 自分自身の有効な投稿制限を取得する。取得できない場合(権限不足など)は
// 制限なしとして扱い、送信時のエラー表示に判定を委ねる。
const fetchOwnRestriction = async (session: {
  token: string;
  user: { id: string };
}) => {
  try {
    const restriction = await requireBackendData(
      serverApiClient.GET('/api/v1/users/{uuid}/form-submission-restriction', {
        headers: authorizationHeader(session.token),
        params: {
          path: { uuid: session.user.id },
        },
      })
    );

    return toActiveSubmissionRestriction(restriction);
  } catch (error) {
    if (error instanceof BackendError) {
      return null;
    }
    throw error;
  }
};

const Home = async ({ params }: { params: Promise<{ formId: string }> }) => {
  const session = await getSession();
  const isAuthenticated = session.state === 'authenticated';
  const { formId } = await params;

  // ログイン時は認証ヘッダ付き、未ログイン時は匿名でフォームを取得する。
  // restriction はフォーム取得結果に依存しないため並列で取得する。
  const [form, restriction] = await Promise.all([
    requireBackendData(
      serverApiClient.GET('/api/v1/forms/{form_id}', {
        ...(isAuthenticated
          ? { headers: authorizationHeader(session.token) }
          : {}),
        params: {
          path: { form_id: formId },
        },
      })
    ),
    isAuthenticated ? fetchOwnRestriction(session) : Promise.resolve(null),
  ]);

  return (
    <AnswerForm
      questions={form.questions}
      formId={formId}
      title={form.title}
      description={form.description}
      isAuthenticated={isAuthenticated}
      allowTemporaryAnswers={form.settings.allow_temporary_answers}
      restriction={restriction}
    />
  );
};

export default Home;
