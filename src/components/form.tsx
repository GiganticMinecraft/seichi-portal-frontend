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
  FormControlLabel,
  Checkbox,
  Box,
  Alert,
  AlertTitle,
  Stack,
  Divider,
  Button,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { postAnswers } from '@/api/form';
import { Form, FormQuestion } from '@/schemas/formSchema';

interface Props {
  form: Form;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '100%',
}));

export default function Questions({ form }: Props) {
  const [isSubmitted, changeSubmitState] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const unSubmit = () => {
    changeSubmitState(false);
  };

  type NonEmptyArray<T> = [T, ...T[]];

  interface IFormInput {
    [key: string]: NonEmptyArray<string>;
  }

  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit = async (data: IFormInput) => {
    const formAnswers = Object.entries(data).flatMap(function ([key, values]) {
      // Note:
      // ここで型をstringかどうか判定しているのは、valuesに複数の値が入っていた場合にmapを使って
      // 一つのquestion_idとanswerに分離したいという理由がある。
      // valuesは本来NonEmptyArray<string>であるはずだが、React-Hook-Formが渡してくるデータは、
      // 単一の解答であった場合、string、そうでない場合stringの配列となる仕様のため、
      // 仕方なく型によって処理を分離することになった。
      if (typeof values == 'string') {
        return {
          question_id: Number(key),
          answer: values,
        };
      } else {
        return values.map((value) => ({
          question_id: Number(key),
          answer: value,
        }));
      }
    });

    if (await postAnswers(form.id, formAnswers)) {
      changeSubmitState(true);
    }
  };

  const generateInputSpace = (question: FormQuestion) => {
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
      case 'SINGLE': //todo: 選択をリセットできるようにする
        return (
          <Select
            {...register(question.id.toString())}
            required={question.is_required}
            autoWidth
            value={selectedValue}
            onChange={(event) => setSelectedValue(event.target.value)}
            renderValue={() =>
              selectedValue === '' ? <p>（未選択）</p> : <p>{selectedValue}</p>
            }
            displayEmpty
            style={{ paddingLeft: '1rem' }}
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
          <FormGroup aria-required={question.is_required}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {question.choices.map((choice, index) => (
                <FormControlLabel
                  key={`q-${question.id}.a-${index}`}
                  control={
                    <Checkbox
                      {...register(question.id.toString())}
                      value={choice}
                      sx={{
                        wordBreak: 'break-all',
                      }}
                    />
                  }
                  label={choice}
                />
              ))}
            </div>
          </FormGroup>
        );
    }
  };

  if (isSubmitted) {
    return (
      <Box
        sx={{ width: '100%' }}
        display={'flex'}
        alignItems={'center'}
        flexDirection={'column'}
      >
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          回答を送信しました
        </Alert>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        >
          <Button
            variant="contained"
            onClick={unSubmit}
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
      </Box>
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
            {form.questions.map((question) => {
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
                      {question.is_required ? ' *' : null}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {question.description}
                    </Typography>
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
}
