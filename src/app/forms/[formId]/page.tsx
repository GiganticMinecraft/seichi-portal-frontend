import { getForm } from '@/api/form';
import AnswerForm from '@/components/AnswerForm';

export default async function Home({ params }: { params: { formId: number } }) {
  const form = await getForm(params.formId);

  return <AnswerForm form={form} />;
}
