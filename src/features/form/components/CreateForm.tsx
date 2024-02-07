'use client'

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useFieldArray, useForm } from 'react-hook-form';
import { FormGroup, Input } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@material-ui/core/IconButton';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const CreateFormComponent = () => {
  return (
    <><FormTitleAndDescriptionComponent /><CreateQuestionComponent /></>
  )
}

const FormTitleAndDescriptionComponent = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack spacing={2}>
          <Item><TextField id="outlined-basic" label="フォームのタイトル" variant="outlined" required/></Item>
          <Item><TextField id="outlined-basic" label="フォームの説明" variant="outlined" required/></Item>
      </Stack>
    </Box>
  )
}

const CreateQuestionComponent = () => {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      questionTitle: '',
      questionDescription: '',
      choices: [{
        choice: ''
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'choices'
  });

  const [questionType, setQuestionType] = React.useState('TEXT');

  const handleChangeQuestionType = (event: SelectChangeEvent) => {
    setQuestionType(event.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: 'white'}}>
      <FormGroup>
        <Input
          {...register("questionTitle")}
          className="materialUIInput"
          required
          fullWidth
        />
        <Input
          {...register("questionDescription")}
          className="materialUIInput"
          required
          multiline
          fullWidth
        />
        <InputLabel id="AnswerType">回答方法</InputLabel>
        <Select
          labelId="AnswerType"
          id="AnswerType"
          value={questionType}
          onChange={handleChangeQuestionType}
          label="QuestionType"
          required
        >
          <MenuItem value="TEXT">テキスト</MenuItem>
          <MenuItem value="SINGLE">単一選択</MenuItem>
          <MenuItem value="MULTIPLE">複数選択</MenuItem>
        </Select>
        {
          questionType != 'TEXT' ? fields.map((field, index) =>(
            <TextField {...register(`choices.${index}.choice`)} key={field.id} id="outlined-basic" label="選択肢" required variant="outlined" InputProps={{
              endAdornment: <IconButton aria-label="delete" onClick={() => {
                if (index != 0) {
                  remove(index)
                }
              }}><DeleteIcon />
            </IconButton>
            }} onKeyDown={ e => {
              // @ts-ignore (KeyBoardEventには入力した値を取得する関数は存在しないが、何も入力されていないときにはこのイベントを発火したくない)
              if (e.key == 'Enter' && e.target.value != '') {
                append({choice: ''})
              }
            }} />
          )) : <></>
        }
      </FormGroup>
    </Box>
  )
}
