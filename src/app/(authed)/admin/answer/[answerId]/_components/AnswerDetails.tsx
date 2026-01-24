import { Label, Message, Send } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { removeDuplicates } from '@/generic/ArrayExtra';
import { formatString } from '@/generic/DateFormatter';
import type {
  GetAnswerLabelsResponse,
  GetAnswerResponse,
  GetQuestionsResponse,
} from '@/app/api/_schemas/ResponseSchemas';

const AnswerTitleForm = (props: { answers: GetAnswerResponse }) => {
  const { handleSubmit, register } = useForm<{ title: string }>();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(props.answers.title);

  const onSubmit = async (data: { title: string }) => {
    const response = await fetch(
      `/api/proxy/forms/answers/${props.answers.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
        }),
      }
    );

    if (response.ok) {
      setIsEditing(false);
      setTitle(data.title);
    }
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      spacing={2}
    >
      {isEditing ? (
        <TextField {...register('title')} defaultValue={title} required />
      ) : (
        <Typography variant="h4">{title}</Typography>
      )}
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
    </Stack>
  );
};

const AnswerLabels = (props: {
  labelOptions: GetAnswerLabelsResponse;
  answers: GetAnswerResponse;
}) => {
  const onChangeLabels = async (labels: GetAnswerLabelsResponse) => {
    await fetch(`/api/proxy/forms/answers/${props.answers.id}/labels`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        labels: labels.map((label) => label.id),
      }),
    });
  };

  return (
    <Autocomplete
      multiple
      id="label"
      options={props.labelOptions.map((label) => label.name)}
      getOptionLabel={(option) => option}
      defaultValue={props.answers.labels.map((label) => label.name)}
      renderTags={(value: readonly string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip
            label={option}
            sx={{ background: '#FFFFFF29' }}
            {...getTagProps({ index })}
            key={index}
          />
        ))
      }
      renderOption={(props, option) => {
        return (
          <Box
            {...props}
            key={option}
            component="span"
            style={{ color: 'black' }}
          >
            {option}
          </Box>
        );
      }}
      renderInput={(params) => (
        // @ts-expect-error (解決方法がよくわからないのでとりあえずignoreする)
        // FIXME: あとで調べる
        <TextField
          {...params}
          variant="standard"
          sx={{ borderBottom: '1px solid #FFFFFF6B' }}
        />
      )}
      onChange={async (_event, value) => {
        await onChangeLabels(
          props.labelOptions.filter((label) => value.includes(label.name))
        );
      }}
    />
  );
};

const AnswerMeta = (props: {
  answers: GetAnswerResponse;
  labels: GetAnswerLabelsResponse;
}) => {
  return (
    <Grid container spacing={2}>
      <Grid size={6}>
        <Typography sx={{ fontWeight: 'bold' }}>回答者</Typography>
        {props.answers.user.name}
      </Grid>
      <Grid size={6}>
        <Typography sx={{ fontWeight: 'bold' }}>回答日時</Typography>
        {formatString(props.answers.timestamp)}
      </Grid>
      <Grid size={6}>
        <Typography sx={{ fontWeight: 'bold' }}>ラベル</Typography>
        <AnswerLabels labelOptions={props.labels} answers={props.answers} />
      </Grid>
      <Grid size={6}>
        <Stack spacing={2} direction="row">
          <Button
            variant="contained"
            href="/admin/labels/answers"
            startIcon={<Label />}
          >
            ラベルの管理
          </Button>
          <Button
            variant="contained"
            href={`/admin/answer/${props.answers.id}/messages`}
            startIcon={<Message />}
          >
            回答者にメッセージを送信
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

type AnswerWithQuestionInfo = {
  questionTitle: string;
  answers: string[];
};

const Answers = (props: { answers: AnswerWithQuestionInfo }) => {
  return (
    <Stack>
      <Typography sx={{ fontWeight: 'bold' }}>
        {props.answers.questionTitle}
      </Typography>
      {props.answers.answers.join(', ')}
    </Stack>
  );
};

const AnswerDetails = (props: {
  answers: GetAnswerResponse;
  questions: GetQuestionsResponse;
  labels: GetAnswerLabelsResponse;
}) => {
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

  return (
    <Stack spacing={2}>
      <AnswerTitleForm answers={props.answers} />
      <AnswerMeta answers={props.answers} labels={props.labels} />
      {answerWithQeustionInfo.length === 0 ? (
        <Typography>回答がありません</Typography>
      ) : (
        answerWithQeustionInfo.map((answer, index) => (
          <Answers key={index} answers={answer} />
        ))
      )}
    </Stack>
  );
};

export default AnswerDetails;
