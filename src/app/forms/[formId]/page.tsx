import { Alert, AlertTitle, Box } from '@mui/material';
import { isErr, unwrapOk } from 'option-t/esm/PlainResult';
import { getForm, getQuestions } from '@/features/form/api/form';
import AnswerForm from '@/features/form/components/AnswerForm';
import { getCachedToken } from '@/features/user/api/mcToken';

const Home = async ({ params }: { params: { formId: number } }) => {
  const token = getCachedToken() ?? '';
  const form = await getForm(params.formId, token);
  const questions = await getQuestions(params.formId, token);
  if (isErr(form) || isErr(questions)) {
    console.log(form);
    console.log(questions);

    return (
      <Box sx={{ width: '100%' }}>
        <Alert severity="error">
          <AlertTitle>フォーム情報を取得できませんでした</AlertTitle>
        </Alert>
      </Box>
    );
  }

  return <AnswerForm form={unwrapOk(form)} questions={unwrapOk(questions)} />;
};

export default Home;
