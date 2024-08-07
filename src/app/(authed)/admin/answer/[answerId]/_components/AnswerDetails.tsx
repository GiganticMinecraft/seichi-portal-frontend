import { Send } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { removeDuplicates } from '@/generic/ArrayExtra';
import { formatString } from '@/generic/DateFormatter';
import type {
  GetAnswerResponse,
  GetQuestionsResponse,
} from '@/app/api/_schemas/ResponseSchemas';

const AnswerDetails = (props: {
  answers: GetAnswerResponse;
  questions: GetQuestionsResponse;
}) => {
  const { handleSubmit, register } = useForm<{ title: string }>();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(props.answers.title);

  type AnswerWithQuestionInfo = {
    questionTitle: string;
    answers: string[];
  };

  const answerWithQeustionInfo = removeDuplicates(
    props.answers.answers.map((answer) => answer.question_id)
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

  const onSubmit = async (data: { title: string }) => {
    const response = await fetch(`/api/answers/${props.answers.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: data.title,
      }),
    });

    if (response.ok) {
      setIsEditing(false);
      setTitle(data.title);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={10}>
        {isEditing ? (
          <TextField {...register('title')} defaultValue={title} required />
        ) : (
          <Typography variant="h4">{title}</Typography>
        )}
      </Grid>
      <Grid item xs={2}>
        {isEditing ? (
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleSubmit(onSubmit)}
          >
            編集完了
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
          >
            タイトルを編集
          </Button>
        )}
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
