'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Form } from '@/schemas/formSchema';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';

interface Props {
  form: Form;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Questions(form: Props) {
  const [isSended, changeSendedState] = React.useState(false);

  const send = () => {
    changeSendedState(true);
  };

  const unSend = () => {
    changeSendedState(false);
  };

  if (isSended) {
    return (
      <Box sx={{ width: '20%' }}>
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          回答を送信しました
        </Alert>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        >
          <Item>
            <Button variant="contained" onClick={unSend}>
              ← 別の回答をする
            </Button>
          </Item>
          <Item>
            <Link href="/forms">
              <Button variant="contained">フォーム一覧へ →</Button>
            </Link>
          </Item>
        </Stack>
      </Box>
    );
  } else {
    return (
      <Box sx={{ width: '100%' }}>
        <Stack spacing={2}>
          {form.form.questions.map((question, index) => {
            switch (question.question_type) {
              case 'TEXT':
                return (
                  <Item key={index}>
                    {textQuestion({
                      title: question.title,
                      description: question.description,
                    })}
                  </Item>
                );
              case 'SINGLE':
                return (
                  <Item key={index}>
                    {radioQuestion({
                      title: question.title,
                      description: question.description,
                      choices: question.choices,
                    })}
                  </Item>
                );
              case 'MULTIPLE':
                return (
                  <Item key={index}>
                    {checkboxQuestion({
                      title: question.title,
                      description: question.description,
                      choices: question.choices,
                    })}
                  </Item>
                );
            }
          })}
          <Button variant="contained" endIcon={<SendIcon />} onClick={send}>
            送信
          </Button>
        </Stack>
      </Box>
    );
  }
}

function checkboxQuestion(question: {
  title: string;
  description: string;
  choices: string[];
}) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {question.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {question.description}
        </Typography>
        <Typography variant="body2">
          <FormGroup>
            {question.choices.map((choice) => {
              return <FormControlLabel control={<Checkbox />} label={choice} />;
            })}
          </FormGroup>
        </Typography>
      </CardContent>
    </Card>
  );
}

function radioQuestion(question: {
  title: string;
  description: string;
  choices: string[];
}) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {question.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {question.description}
        </Typography>
        <Typography variant="body2">
          <FormControl>
            <RadioGroup name={question.title} defaultChecked>
              {question.choices.map((choice) => {
                return (
                  <FormControlLabel
                    control={<Radio />}
                    value={choice}
                    label={choice}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
        </Typography>
      </CardContent>
    </Card>
  );
}

function textQuestion(question: { title: string; description: string }) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {question.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {question.description}
        </Typography>
        <Typography variant="body2">
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-multiline-static"
              label="回答を入力"
              multiline
              rows={4}
            />
          </Box>
        </Typography>
      </CardContent>
    </Card>
  );
}
