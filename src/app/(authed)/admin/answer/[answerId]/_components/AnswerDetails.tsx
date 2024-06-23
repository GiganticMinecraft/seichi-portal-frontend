import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { formatString } from '@/generic/DateFormatter';
import type {
  GetAnswerResponse,
  GetQuestionsResponse,
} from '@/app/api/_schemas/ResponseSchemas';

const AnswerDetails = (props: {
  answers: GetAnswerResponse;
  questions: GetQuestionsResponse;
}) => {
  type AnswerWithQuestionInfo = {
    questionTitle: string;
    answers: string[];
  };

  // NOTE: TypeScript の Set 型は順番を維持する
  // ref: https://zenn.dev/notfounds/scraps/d8a0e4b99ddc38
  const answerWithQeustionInfo = Array.from(
    new Set(props.answers.answers.map((answer) => answer.question_id))
  ).map((questionId) => {
    const answerWithQuestionInfo: AnswerWithQuestionInfo = {
      questionTitle:
        props.questions.find((question) => question.id == questionId)?.title ||
        '',
      answers: props.answers.answers
        .filter((answer) => answer.question_id == questionId)
        .map((answer) => answer.answer),
    };

    return answerWithQuestionInfo;
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {props.answers.title}
      </Grid>
      <Grid item xs={6}>
        <Typography sx={{ fontWeight: 'bold' }}>回答者</Typography>
        {props.answers.user.name}
      </Grid>
      <Grid item xs={6}>
        <Typography sx={{ fontWeight: 'bold' }}>回答日時</Typography>
        {formatString(props.answers.timestamp)}
      </Grid>
      {answerWithQeustionInfo.map((answer, index) => (
        <Grid item xs={12} key={index}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ fontWeight: 'bold' }}>
              {answer.questionTitle}
            </Grid>
            <Grid item xs={12}>
              {answer.answers.join(', ')}
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default AnswerDetails;
