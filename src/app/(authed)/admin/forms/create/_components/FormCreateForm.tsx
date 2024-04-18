import { zodResolver } from '@hookform/resolvers/zod';
import { Add } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
} from '@mui/material';
import { useFieldArray, useForm } from 'react-hook-form';
import FormSettings from './FormSettings';
import QuestionComponent from './Question';
import { formSchema } from '../_schema/createFormSchema';
import type { Form } from '../_schema/createFormSchema';

const FormCreateForm = () => {
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const addQuestionButton = () => {
    append({
      title: '',
      description: '',
      question_type: 'TEXT',
      choices: [],
      is_required: false,
    });
  };

  const onSubmit = (data: Form) => {
    // todo: データの送信処理を書く
    console.log(data);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={10}>
        <Container component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <FormSettings control={control} register={register} />
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
        <Card>
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

export default FormCreateForm;
