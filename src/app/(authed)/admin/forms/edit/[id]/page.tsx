import FormEditForm from './_components/FormEditForm';
import { backendFetchJson } from '@/lib/server/backend';
import { requireAdmin } from '@/lib/server/session';
import type { GetFormLabelsResponse, GetFormResponse } from '@/lib/api-types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'フォーム編集 | Seichi Portal',
};

const Home = async ({ params }: { params: Promise<{ id: number }> }) => {
  const session = await requireAdmin();
  const { id } = await params;
  const [form, labels] = await Promise.all([
    backendFetchJson<GetFormResponse>(`/forms/${id}`, {
      method: 'GET',
      token: session.token,
    }),
    backendFetchJson<GetFormLabelsResponse>('/labels/forms', {
      method: 'GET',
      token: session.token,
    }),
  ]);

  return <FormEditForm form={form} labelOptions={labels} />;
};

export default Home;
