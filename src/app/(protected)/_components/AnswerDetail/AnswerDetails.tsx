'use client';

import { Paper, Stack, Typography } from '@mui/material';

import MarkdownText from '@/app/_components/MarkdownText';
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
      // 自由記述(Text型)のみ回答をMarkdownとして解釈する。選択式は選択肢ラベルの
      // プレーン表示のままでよく、question が見つからない場合も安全側でプレーン表示になる。
      // なお Text 型は入力側 (QuestionFieldRenderer) が単一フィールドとして登録するため
      // 実質1問1回答だが、型上は同一質問への複数回答値を排除できないため join で連結する。
      isMarkdown: question?.question_type === 'Text',
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
                component="h2"
                sx={{ fontWeight: 'bold', mb: 1 }}
              >
                {answerWithQuestionTitle.questionTitle}
              </Typography>
              {answerWithQuestionTitle.isMarkdown ? (
                <MarkdownText>{answerWithQuestionTitle.answers}</MarkdownText>
              ) : (
                <Typography
                  sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
                >
                  {answerWithQuestionTitle.answers}
                </Typography>
              )}
            </Paper>
          );
        })
      )}
    </Stack>
  );
};

export default AnswerDetails;
