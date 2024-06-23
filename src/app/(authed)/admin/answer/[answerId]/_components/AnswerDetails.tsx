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
  console.log(props.answers, props.questions);

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
      {props.answers.answers.map((answer, index) => (
        <Grid item xs={12} key={index}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ fontWeight: 'bold' }}>
              {
                props.questions.find(
                  (question) => question.id == answer.question_id
                )?.title
              }
            </Grid>
            <Grid item xs={12}>
              {answer.answer}
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default AnswerDetails;
