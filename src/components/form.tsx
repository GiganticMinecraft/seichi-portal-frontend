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
        <Button variant="contained" endIcon={<SendIcon />}>
          送信
        </Button>
      </Stack>
    </Box>
  );
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
          <FormGroup>
            {question.choices.map((choice) => {
              return <FormControlLabel control={<Radio />} label={choice} />;
            })}
          </FormGroup>
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
