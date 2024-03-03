import { isRight } from 'fp-ts/lib/Either';
import { redirectOrDoNothing } from '@/app/error/RedirectByErrorResponse';
import { getFormQuestions } from '@/features/form/api/form';
import AnswerForm from '@/features/form/components/AnswerForm';
import { getCachedToken } from '@/features/user/api/mcToken';

const Home = async ({ params }: { params: { formId: number } }) => {
  const token = (await getCachedToken()) ?? '';
  const questions = await getFormQuestions(params.formId, token);

  if (isRight(questions)) {
    return <AnswerForm questions={questions.right} formId={params.formId} />;
  } else {
    redirectOrDoNothing(questions);
    return <></>;
  }
};

export default Home;
