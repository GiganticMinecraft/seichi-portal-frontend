import AnswerForm from './_components/AnswerForm';
import { backendFetchJson } from '@/lib/server/backend';
import { requireUser } from '@/lib/server/session';
import type { GetFormResponse } from '@/lib/api-types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'フォーム回答 | Seichi Portal',
};

const Home = async ({ params }: { params: Promise<{ formId: string }> }) => {
  const session = await requireUser();
  const { formId } = await params;
  const form = await backendFetchJson<GetFormResponse>(`/forms/${formId}`, {
    method: 'GET',
    token: session.token,
  });

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
