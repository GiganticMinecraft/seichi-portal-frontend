import { zodResolver } from '@hookform/resolvers/zod';
import { Add } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { formSchema } from './_schema/createFormSchema';
import type { Form } from './_schema/createFormSchema';
import type { Control, UseFormRegister } from 'react-hook-form';

const QuestionComponent = ({
  control,
  register,
  removeQuestion,
  questionId,
}: {
  control: Control<Form>;
  register: UseFormRegister<Form>;
  removeQuestion: (index: number) => void;
  questionId: number;
}) => {
  const {
    fields: choicesField,
    append: appendChoices,
    remove: removeChoices,
  } = useFieldArray({
    control: control,
    name: `questions.${questionId}.choices`,
  });

  const useWatchQuestionType = useWatch({
    control,
    name: `questions.${questionId}.question_type`,
    defaultValue: 'TEXT',
  });

  const addChoice = useCallback(() => {
    if (useWatchQuestionType !== 'TEXT') {
      appendChoices({ choice: '' });
    }
  }, [useWatchQuestionType, appendChoices]);

  const removeChoice = (index: number) => {
    if (choicesField.length > 1) {
      removeChoices(index);
    }
  };

  useEffect(() => {
    if (useWatchQuestionType === 'TEXT') {
      removeChoices();
    } else {
      addChoice();
    }
  }, [useWatchQuestionType, addChoice, removeChoices]);

  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        質問{questionId + 1} (question_id: {questionId})
      </Typography>
      <Button
        variant="outlined"
        startIcon={<DeleteIcon />}
        onClick={() => removeQuestion(questionId)}
      >
        質問の削除
      </Button>
      <TextField
        {...register(`questions.${questionId}.title`)}
        label="質問タイトル"
        required
      />
      <TextField
        {...register(`questions.${questionId}.description`)}
        label="質問の説明"
      />
      <TextField
        {...register(`questions.${questionId}.question_type`)}
        label="質問の種類"
        select
        required
        defaultValue="TEXT"
        helperText="質問の種類を選択してください。"
      >
        <MenuItem value="TEXT">テキスト</MenuItem>
        <MenuItem value="SINGLE">単一選択</MenuItem>
        <MenuItem value="MULTIPLE">複数選択</MenuItem>
      </TextField>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={addChoice}
        disabled={useWatchQuestionType == 'TEXT'}
      >
        選択肢の追加
      </Button>
      {choicesField.map((field, index) => {
        return (
          <Stack direction="row" key={field.id}>
            <TextField
              {...register(`questions.${questionId}.choices.${index}.choice`)}
              key={field.id}
              label={`選択肢${index + 1}`}
              required
            />
            <IconButton size="small" onClick={() => removeChoice(index)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        );
      })}
    </Stack>
  );
};

export const CreateFormComponent = () => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Form>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    resolver: zodResolver(formSchema),
  });

  const visibility = useWatch({
    control,
    name: 'settings.visibility',
    defaultValue: 'PUBLIC',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = (data: Form) => {
    // todo: データの送信処理を書く
    console.log(data);
  };

  const addQuestionButton = () => {
    append({
      title: '',
      description: '',
      question_type: 'TEXT',
      choices: [],
      is_required: false,
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={10}>
        <Container component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                background:
                  'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.05) 100%), #121212',
                boxShadow:
                  '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12)',
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    フォーム設定
                  </Typography>
                  <TextField
                    {...register('title')}
                    label="フォームタイトル"
                    required
                  />
                  <TextField
                    {...register('description')}
                    label="フォームの説明"
                    required
                  />
                  <TextField
                    {...register('settings.response_period.start_at')}
                    label="回答開始日"
                    type="datetime-local"
                    helperText="回答開始日と回答終了日はどちらも指定する必要があります。"
                  />
                  <TextField
                    {...register('settings.response_period.end_at')}
                    label="回答終了日"
                    type="datetime-local"
                    helperText="回答開始日と回答終了日はどちらも指定する必要があります。"
                  />
                  <TextField
                    {...register('settings.visibility')}
                    label="公開設定"
                    defaultValue={visibility}
                    select
                    required
                  >
                    <MenuItem value="PUBLIC">公開</MenuItem>
                    <MenuItem value="PRIVATE">非公開</MenuItem>
                  </TextField>
                  <TextField
                    {...register('settings.webhook_url')}
                    label="Webhook URL"
                    type="url"
                  />
                  <TextField
                    {...register('settings.default_answer_title')}
                    label="デフォルトの回答タイトル"
                    helperText="回答が送信されたときに設定されるタイトルで、$[question_id]で指定の質問の回答をタイトルに埋め込むことができます。"
                  />
                </Stack>
              </CardContent>
              {fields.map((field, index) => (
                <CardContent key={field.id}>
                  <QuestionComponent
                    control={control}
                    register={register}
                    removeQuestion={remove}
                    questionId={index}
                  />
                </CardContent>
              ))}
            </Card>
            {errors.root && (
              <Alert severity="error">{errors.root.message}</Alert>
            )}
            <Button type="submit" variant="contained" endIcon={<SendIcon />}>
              フォーム作成
            </Button>
          </Stack>
        </Container>
      </Grid>
      <Grid item xs={2}>
        <Card
          sx={{
            position: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.05) 100%), #121212',
            boxShadow:
              '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12)',
          }}
        >
          <CardContent>
            <Button
              type="button"
              aria-label="質問の追加"
              onClick={addQuestionButton}
              endIcon={<Add />}
            >
              質問の追加
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
