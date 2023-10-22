import { getForm } from '@/features/form/api/form';
import AnswerForm from '@/features/form/components/AnswerForm';
import { getCachedToken } from '@/features/user/api/mcToken';

const Home = async ({ params }: { params: { formId: number } }) => {
  const token = getCachedToken() ?? '';
  const form = await getForm(params.formId, token);

  return <AnswerForm form={form} />;
};

export default Home;
