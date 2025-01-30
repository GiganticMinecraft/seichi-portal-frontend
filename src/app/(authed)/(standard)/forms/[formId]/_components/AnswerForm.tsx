'use client';

import { ArrowBack, ArrowForward } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import {
  styled,
  Paper,
  Input,
  Select,
  MenuItem,
  FormGroup,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Box,
  Alert,
  AlertTitle,
  Stack,
  Button,
  Typography,
  Link,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { errorResponseSchema } from '@/app/api/_schemas/ResponseSchemas';
import type { GetQuestionsResponse } from '@/app/api/_schemas/ResponseSchemas';
import type { NonEmptyArray } from '@/generic/Types';

type Question = {
  id: number;
  title: string;
  description: string;
  question_type: 'TEXT' | 'SINGLE' | 'MULTIPLE';
  choices: string[];
  is_required: boolean;
};

interface Props {
  questions: GetQuestionsResponse;
  formId: number;
}

interface IFormInput {
  [key: string]: string | NonEmptyArray<string> | boolean;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '100%',
}));

const AnswerForm = ({ questions: questions, formId }: Props) => {
  const [isSubmitted, toggleIsSubmitted] = useState(false);
  const [selectedValues, setSelectedValues] = useState<{ [x: string]: string }>(
    {}
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();

  const resetIsSubmitted = () => {
    toggleIsSubmitted(false);
  };

  const onSubmit = async (data: IFormInput) => {
    const formAnswers = Object.entries(data).flatMap(([key, values]) => {
      // Note:
      // ここで型をstringかどうか判定しているのは、valuesに複数の値が入っていた場合にmapを使って
      // 一つのquestion_idとanswerに分離したいという理由がある。
      // valuesは本来NonEmptyArray<string>であるはずだが、React-Hook-Formが渡してくるデータは、
      // 以下のような仕様のため、仕方なく型によって処理を分離することになった。
      // 単一の解答: string
      // 複数選択可能で選択されているものがある回答: NonEmptyArray<string>
      // 複数選択可能で選択されているものがない回答: boolean
      if (typeof values == 'string') {
        return {
          question_id: Number(key),
          answer: values,
        };
      } else if (typeof values === 'boolean') {
        return [
          {
            question_id: Number(key),
            answer: '',
          },
        ];
      } else {
        return values.map((value) => ({
          question_id: Number(key),
          answer: value,
        }));
      }
    });

    const postAnswerResponse = await fetch('/api/proxy/answers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        form_id: Number(formId),
        answers: formAnswers,
      }),
    });

    if (postAnswerResponse.ok) {
      toggleIsSubmitted(true);
      reset();
      setSelectedValues({});

      return;
    }

    const safeParsedErrorResponse = errorResponseSchema.safeParse(
      await postAnswerResponse.json()
    );

    if (
      safeParsedErrorResponse.success &&
      safeParsedErrorResponse.data.errorCode == 'OUT_OF_PERIOD'
    ) {
      alert('回答期間が終了しています');
    }
  };

  const generateInputSpace = (question: Question) => {
    switch (question.question_type) {
      case 'TEXT':
        return (
          <Input
            {...register(question.id.toString())}
            className="materialUIInput"
            required={question.is_required}
            multiline
            fullWidth
          />
        );
      case 'SINGLE':
        // TODO: 選択をリセットできるようにする
        // TODO: 何も選択されなかったとき、APIに送られる値は空文字になるが許容されるか？undefinedやnullでなくてよい？
        const questionId = question.id.toString();
        return (
          <Select
            {...register(questionId)}
            required={question.is_required}
            autoWidth
            value={selectedValues[questionId] ?? ''}
            onChange={(event) => {
              setSelectedValues({
                ...selectedValues,
                [questionId]: event.target.value,
              });
            }}
            renderValue={() =>
              !!selectedValues[questionId] ? (
                <p>{selectedValues[questionId]}</p>
              ) : (
                <p>（未選択）</p>
              )
            }
            displayEmpty
            style={{
              paddingLeft: '1rem',
              marginTop: '1rem',
            }}
          >
            {question.choices.map((choice, index) => {
              return (
                <MenuItem key={`q-${question.id}.a-${index}`} value={choice}>
                  {choice}
                </MenuItem>
              );
            })}
          </Select>
        );
      case 'MULTIPLE':
        return (
          <>
            <FormGroup
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {question.choices.map((choice, index) => (
                <FormControlLabel
                  key={`q-${question.id}.a-${index}`}
                  sx={{ width: '24%', justifyContent: 'center' }}
                  control={
                    <Checkbox
                      {...register(question.id.toString(), {
                        validate: {
                          itemMustBeChecked: (v) => {
                            if (!question.is_required) return true;
                            const errorMessage =
                              'この項目は必須です。少なくとも1つの項目にチェックを入れてください';
                            // valueがbooleanであることは、何も選択されている項目がないことを示しているので、エラーとしてよい
                            if (typeof v === 'boolean') return errorMessage;

                            return v.length >= 1 || errorMessage;
                          },
                        },
                      })}
                      value={choice}
                      sx={{
                        wordBreak: 'break-all',
                      }}
                    />
                  }
                  label={choice}
                />
              ))}
            </FormGroup>
            {errors[question.id.toString()] && (
              <FormHelperText sx={{ color: 'red', textAlign: 'center' }}>
                {errors[question.id.toString()]?.message}
              </FormHelperText>
            )}
          </>
        );
    }
  };

  if (isSubmitted) {
    return (
      <Stack
        spacing={2}
        sx={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}
      >
        <Alert severity="success" sx={{ width: '20%' }}>
          <AlertTitle>Success</AlertTitle>
          回答を送信しました
        </Alert>
        <Stack
          spacing={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            variant="contained"
            onClick={resetIsSubmitted}
            startIcon={<ArrowBack />}
          >
            別の回答をする
          </Button>
          <Link href="/forms">
            <Button variant="contained" endIcon={<ArrowForward />}>
              フォーム一覧へ
            </Button>
          </Link>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Box sx={{ width: '100%' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            spacing={4}
            display={'flex'}
            alignItems={'center'}
            flexDirection={'column'}
          >
            {questions.map((question) => {
              return (
                <Item key={question.id}>
                  <Box
                    width="100%"
                    padding="1rem"
                    display={'flex'}
                    alignItems={'center'}
                    flexDirection={'column'}
                  >
                    <Typography variant="h5">
                      {question.title}
                      {question.is_required ? (
                        <Typography display={'inline'} color={'red'}>
                          {' *'}
                        </Typography>
                      ) : null}
                    </Typography>
                    {question.description && (
                      <Box sx={{ whiteSpace: 'pre-wrap' }}>
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {question.description}
                        </Markdown>
                      </Box>
                    )}
                    <Box width={'70%'}>{generateInputSpace(question)}</Box>
                  </Box>
                </Item>
              );
            })}
            <Button type="submit" variant="contained" endIcon={<SendIcon />}>
              送信
            </Button>
          </Stack>
        </form>
      </Box>
    );
  }
};

export default AnswerForm;
