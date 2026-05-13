'use client';

import { Paper, Stack, Typography } from '@mui/material';
import { removeDuplicates } from '@/generic/ArrayExtra';
import type { GetAnswerResponse, GetQuestionsResponse } from '@/lib/api-types';

const AnswerDetails = (props: {
  answer: GetAnswerResponse;
  questions: GetQuestionsResponse;
}) => {
  const answerWithQuestionTitles = removeDuplicates(
    props.answer.answers.map((answer) => answer.question_id)
  ).map((questionId) => {
    const question = props.questions.find((item) => item.id === questionId);

    return {
      questionTitle: question?.title || '不明なタイトル',
      answers: props.answer.answers
        .filter((answer) => answer.question_id === questionId)
        .map((answer) => answer.answer)
        .join(', '),
    };
  });

  return (
    <Stack spacing={2}>
      {answerWithQuestionTitles.length === 0 ? (
        <Typography>回答がありません</Typography>
      ) : (
        answerWithQuestionTitles.map((answerWithQuestionTitle, key) => {
          return (
            <Paper key={key} variant="outlined" sx={{ p: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 'bold', mb: 1 }}
              >
                {answerWithQuestionTitle.questionTitle}
              </Typography>
              <Typography
                sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
              >
                {answerWithQuestionTitle.answers}
              </Typography>
            </Paper>
          );
        })
      )}
    </Stack>
  );
};

export default AnswerDetails;
