import { getFormQuestions } from '@/features/form/api/form';
import AnswerForm from '@/features/form/components/AnswerForm';
import { getCachedToken } from '@/features/user/api/mcToken';

const Home = async ({ params }: { params: { formId: number } }) => {
  const token = (await getCachedToken()) ?? '';
  const questions = await getFormQuestions(params.formId, token);

  return <AnswerForm questions={questions} formId={params.formId} />;
};

export default Home;
