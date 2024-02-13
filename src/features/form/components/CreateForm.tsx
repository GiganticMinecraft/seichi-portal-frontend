'use client';

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import Add from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Input } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { isLeft } from 'fp-ts/lib/Either';
import * as React from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { match } from 'ts-pattern';
import { addQuestions, createForm, updateFormMetaData } from '../api/form';
import type { ErrorResponse } from '../api/form';
import type { Visibility } from '../types/formSchema';
import type {
  Control,
  UseFieldArrayAppend,
  UseFormRegister,
} from 'react-hook-form';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

interface IForm {
  formTitle: string;
  formDescription: string;
  responsePeriod: {
    startAt: string;
    endAt: string;
  };
  questions: Question[];
  visibility: Visibility;
}

interface Token {
  token: string;
}

export const CreateFormComponent = ({ token }: Token) => {
  const { register, handleSubmit, control } = useForm<IForm>({
    defaultValues: {
      formTitle: '',
      formDescription: '',
      responsePeriod: {
        startAt: '',
        endAt: '',
      },
      questions: [
        {
          questionTitle: '',
          questionDescription: '',
          answerType: 'TEXT',
          choices: [
            {
              choice: '',
            },
          ],
          isRequired: false,
        },
      ],
      visibility: 'PUBLIC',
    },
  });

  const visibility = useWatch({
    control,
    name: 'visibility',
  });

  const getErrorReason = (errorResponse: ErrorResponse) => {
    return match(errorResponse)
      .with('Unauhorization', () => '認証されていません')
      .with('Forbidden', () => '権限が足りません')
      .with('InternalError', () => 'サーバーエラーが発生しました')
      .with('UnknownError', () => '不明なエラーが発生しました')
      .exhaustive();
  };

  const onSubmit = async (data: IForm) => {
    const createFormResult = await createForm(
      token,
      data.formTitle,
      data.formDescription
    );

    if (isLeft(createFormResult)) {
      alert(
        `フォーム作成時にエラーが発生しました。
         理由: ${getErrorReason(createFormResult.left)}`
      );
    } else {
      const createdFormId = createFormResult.right.id;
      const addQuestionResult = await addQuestions(
        token,
        createdFormId,
        data.questions
      );
      if (isLeft(addQuestionResult)) {
        alert(
          `質問追加時にエラーが発生しました。
           理由: ${getErrorReason(addQuestionResult.left)}`
        );
      } else {
        const updateFormMetaResult = await updateFormMetaData(
          token,
          createdFormId,
          data.responsePeriod,
          data.visibility
        );

        if (isLeft(updateFormMetaResult)) {
          alert(
            `回答可能期間と公開設定を設定中にエラーが発生しました。
             理由: ${getErrorReason(updateFormMetaResult.left)}`
          );
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <FormSettingsConponent
          register={register}
          control={control}
          visibility={visibility}
        />
        <CreateQuestionComponent
          register={register}
          control={control}
          visibility={visibility}
        />
        <Button type="submit" variant="contained" endIcon={<SendIcon />}>
          フォーム作成
        </Button>
      </FormGroup>
    </form>
  );
};

interface FormProps {
  register: UseFormRegister<IForm>;
  control: Control<IForm, IForm>;
  visibility: Visibility;
}

const FormSettingsConponent = ({ register, visibility }: FormProps) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack spacing={2}>
        <Item>
          <TextField
            {...register('formTitle')}
            label="フォームのタイトル"
            variant="outlined"
            required
          />
        </Item>
        <Item>
          <TextField
            {...register('formDescription')}
            label="フォームの説明"
            variant="outlined"
            required
          />
        </Item>
        <Item>
          <InputLabel htmlFor="avaliable-start-at">回答開始日</InputLabel>
          <TextField
            {...register('responsePeriod.startAt')}
            id="avaliable-start-at"
            type="datetime-local"
            variant="outlined"
            required
          />
        </Item>
        <Item>
          <InputLabel htmlFor="avaliable-end-at">回答終了日</InputLabel>
          <TextField
            {...register('responsePeriod.endAt')}
            id="avaliable-end-at"
            type="datetime-local"
            variant="outlined"
            required
          />
        </Item>
        <Item>
          <Select
            {...register('visibility')}
            labelId="Visibility"
            id="Visibility"
            value={visibility}
            label="QuestionType"
            required
          >
            <MenuItem value="PUBLIC">公開</MenuItem>
            <MenuItem value="PRIVATE">非公開</MenuItem>
          </Select>
        </Item>
      </Stack>
    </Box>
  );
};

interface Choice {
  choice: string;
}

interface Question {
  questionTitle: string;
  questionDescription: string;
  answerType: string;
  choices: Choice[];
  isRequired: boolean;
}

interface QuestionProps {
  control: Control<IForm, IForm>;
  register: UseFormRegister<IForm>;
  questionIndex: number;
  removeQuestion: (index: number) => void;
  answerType: (index: number) => string;
}

interface ChoiceProps {
  register: UseFormRegister<IForm>;
  questionIndex: number;
  choiceIndex: number;
  appendChoice: UseFieldArrayAppend<IForm, `questions.${number}.choices`>;
  removeChoice: (index: number) => void;
}

const InputChoiceItem = ({
  register,
  questionIndex,
  choiceIndex,
  appendChoice,
  removeChoice,
}: ChoiceProps) => {
  return (
    <TextField
      {...register(`questions.${questionIndex}.choices.${choiceIndex}.choice`)}
      id="outlined-basic"
      label="選択肢"
      required
      variant="outlined"
      InputProps={{
        endAdornment: (
          <IconButton
            aria-label="delete"
            onClick={() => {
              if (choiceIndex != 0) {
                removeChoice(choiceIndex);
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        ),
      }}
      onKeyDown={(e) => {
        // @ts-expect-error (KeyBoardEventには入力した値を取得する関数は存在しないが、何も入力されていないときにはこのイベントを発火したくない)
        if (e.key == 'Enter' && e.target.value != '') {
          appendChoice({ choice: '' });
        }
      }}
    />
  );
};

const QuestionItem = ({
  control,
  register,
  questionIndex,
  removeQuestion,
  answerType,
}: QuestionProps) => {
  const {
    fields: choicesField,
    append: appendChoice,
    remove: removeChoice,
  } = useFieldArray({
    control: control,
    name: `questions.${questionIndex}.choices`,
  });

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: 'white' }}>
      <IconButton
        aria-label="delete"
        onClick={() => {
          if (questionIndex != 0) {
            removeQuestion(questionIndex);
          }
        }}
      >
        <DeleteIcon />
      </IconButton>
      <FormControlLabel
        {...register(`questions.${questionIndex}.isRequired`)}
        control={<Checkbox />}
        label="この質問の回答を必須項目にする"
      />
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
      {answerType(questionIndex) != 'TEXT' ? (
        choicesField.map((field, index) => (
          <InputChoiceItem
            key={field.id}
            register={register}
            questionIndex={questionIndex}
            choiceIndex={index}
            removeChoice={removeChoice}
            appendChoice={appendChoice}
          />
        ))
      ) : (
        <></>
      )}
    </Box>
  );
};

const CreateQuestionComponent = ({ register, control }: FormProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions`,
  });
  const useAnswerType = (questionIndex: number) =>
    useWatch({
      control,
      name: `questions.${questionIndex}.answerType`,
    });

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() =>
          append({
            questionTitle: '',
            questionDescription: '',
            answerType: 'TEXT',
            choices: [
              {
                choice: '',
              },
            ],
            isRequired: false,
          })
        }
      >
        質問の追加
      </Button>
      {fields.map((field, index) => (
        <QuestionItem
          key={field.id}
          control={control}
          register={register}
          questionIndex={index}
          removeQuestion={remove}
          answerType={useAnswerType}
        />
      ))}
    </>
  );
};
