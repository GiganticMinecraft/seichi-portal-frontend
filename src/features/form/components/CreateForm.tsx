'use client'

import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import Add from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Input } from '@mui/material';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import type { Control, UseFieldArrayAppend, UseFormRegister} from 'react-hook-form';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

interface IForm {
  formTitle: '';
  formDescription: '';
  questions: Question[]
}

export const CreateFormComponent = () => {
  const { register, handleSubmit, control } = useForm<IForm>({
    defaultValues: {
      formTitle: '',
      formDescription: '',
      questions: [{
        questionTitle: '',
        questionDescription: '',
        answerType: 'TEXT',
        choices: [{
          choice: ''
        }]
      }]
    }
  });

  const onSubmit = (data: IForm) => {
    // TODO: 投稿時の処理を書く
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <FormTitleAndDescriptionComponent register={register} control={control} />
        <CreateQuestionComponent register={register} control={control} />
        <Button type="submit" variant="contained" endIcon={<SendIcon />}>
          フォーム作成
        </Button>
      </FormGroup>
    </form>
  )
}

interface FormProps {
  register: UseFormRegister<IForm>;
  control: Control<IForm, any>;
}

const FormTitleAndDescriptionComponent = ({ register }: FormProps) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack spacing={2}>
        <Item><TextField {...register("formTitle")} label="フォームのタイトル" variant="outlined" required/></Item>
        <Item><TextField {...register("formDescription")} label="フォームの説明" variant="outlined" required/></Item>
      </Stack>
    </Box>
  )
}

interface Choice {
  choice: string
}

interface Question {
  questionTitle: '',
  questionDescription: '',
  answerType: 'TEXT',
  choices: Choice[]
}

interface QuestionProps {
  control: Control<IForm, any>;
  register: UseFormRegister<IForm>;
  questionIndex: number;
  removeQuestion: (index: number) => void;
  answerType: (index: number) => string;
}

interface ChoiceProps {
  choiceIndex: number;
  appendChoice: UseFieldArrayAppend<IForm, `questions.${number}.choices`>;
  removeChoice: (index: number) => void;
}

const InputChoiceItem = ({choiceIndex, appendChoice, removeChoice}: ChoiceProps) => {
  return (
    <TextField id="outlined-basic" label="選択肢" required variant="outlined" InputProps={{
      endAdornment: <IconButton aria-label="delete" onClick={() => {
        if (choiceIndex != 0) {
          removeChoice(choiceIndex)
        }
      }}><DeleteIcon />
    </IconButton>
    }} onKeyDown={ e => {
      // @ts-expect-error (KeyBoardEventには入力した値を取得する関数は存在しないが、何も入力されていないときにはこのイベントを発火したくない)
      if (e.key == 'Enter' && e.target.value != '') {
        appendChoice({choice: ''})
      }
    }} />
  )
}

const QuestionItem = (
  { control, register, questionIndex, removeQuestion, answerType }: QuestionProps
  ) => {
  const { fields: choicesField, append: appendChoice, remove: removeChoice } = useFieldArray({
    control: control,
    name: `questions.${questionIndex}.choices`
  })

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: 'white'}}>
      <IconButton aria-label="delete" onClick={() => {
        if (questionIndex != 0) {
          removeQuestion(questionIndex)
        }
      }}>
        <DeleteIcon />
      </IconButton>
      <InputLabel id="questionTitle">質問のタイトル</InputLabel>
      <Input
        {...register(`questions.${questionIndex}.questionTitle`)}
        className="materialUIInput"
        required
        fullWidth
      />
      <InputLabel id="questionDescription">質問の説明</InputLabel>
      <Input
        {...register(`questions.${questionIndex}.questionDescription`)}
        className="materialUIInput"
        required
        multiline
        fullWidth
      />
      <InputLabel id="AnswerType">回答方法</InputLabel>
      <Select
        {...register(`questions.${questionIndex}.answerType`)}
        labelId="AnswerType"
        id="AnswerType"
        value={answerType(questionIndex)}
        label="QuestionType"
        required
      >
        <MenuItem value="TEXT">テキスト</MenuItem>
        <MenuItem value="SINGLE">単一選択</MenuItem>
        <MenuItem value="MULTIPLE">複数選択</MenuItem>
      </Select>
      {answerType(questionIndex) != 'TEXT' ? choicesField.map((field, index) => (
        <InputChoiceItem
          key={field.id}
          choiceIndex={index}
          removeChoice={removeChoice}
          appendChoice={appendChoice}
        />
      )) : <></>}
    </Box>
  )
}

const CreateQuestionComponent = ({ register, control }: FormProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions`
  })
  const answerType = (questionIndex: number) => useWatch({
    control,
    name: `questions.${questionIndex}.answerType`
  })

  return (
    <>
    <Button variant="contained" startIcon={<Add />} onClick={() => append({
        questionTitle: '',
        questionDescription: '',
        answerType: 'TEXT',
        choices: [{
          choice: ''
        }]
      })}
    >質問の追加</Button>
    {fields.map((field, index) => (
      <QuestionItem 
        key={field.id}
        control={control}
        register={register}
        questionIndex={index}
        removeQuestion={remove}
        answerType={answerType}
      />
    ))}
    </>
  )
}
