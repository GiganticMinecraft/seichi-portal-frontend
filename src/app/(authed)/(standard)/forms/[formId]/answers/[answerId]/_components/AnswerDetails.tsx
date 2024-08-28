'use client';

import { Stack, Typography } from '@mui/material';
import type {
  GetAnswerResponse,
  GetQuestionsResponse,
} from '@/app/api/_schemas/ResponseSchemas';

const AnswerDetails = (props: {
  answer: GetAnswerResponse;
  questions: GetQuestionsResponse;
}) => {
  const answerWithQuestionTitles = props.answer.answers.map((answer) => {
    const question = props.questions.find(
      (question) => question.id === answer.question_id
    );

    return {
      questionTitle: question?.title || '不明なタイトル',
      answers: props.answer.answers
        .filter((answer) => answer.question_id === question?.id)
        .map((answer) => answer.answer)
        .join(', '),
    };
  });

  return (
    <Stack spacing={2}>
      {answerWithQuestionTitles.map((answerWithQuestionTitle, key) => {
        return (
          <Stack key={key} spacing={1}>
            <Typography variant="h5">
              {answerWithQuestionTitle.questionTitle}
            </Typography>
            <Typography>{answerWithQuestionTitle.answers}</Typography>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default AnswerDetails;
