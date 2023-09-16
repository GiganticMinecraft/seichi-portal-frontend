import { getForm } from '@/api/form';
import Questions from '@/components/form';

export default async function Home({ params }: { params: { formId: number } }) {
  const form = await getForm(params.formId);

  return <Questions form={form} />;
}
