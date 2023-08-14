'use client';

import * as React from 'react';
import { Form, FormQuestion } from '@/schemas/formSchema';
import { useForm } from 'react-hook-form';
import { Input } from '@material-ui/core';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

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
  // const [isSended, changeSendedState] = React.useState(false);

  // const unSend = () => {
  //   changeSendedState(false);
  // };

  type NonEmptyArray<T> = [T, ...T[]];

  interface IFormInput {
    [key: string]: NonEmptyArray<string>;
  }

  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit = (data: IFormInput) => {
    alert(JSON.stringify(data));
  };

  const generateInputSpace = (question: FormQuestion) => {
    switch (question.question_type) {
      case 'TEXT':
        return (
          <Input
            {...register(question.id.toString())}
            className="materialUIInput"
          />
        );
      case 'SINGLE': //todo: 選択をリセットできるようにする
        return (
          <Select {...register(question.id.toString())}>
            {question.choices.map((choice, index) => {
              return (
                <MenuItem key={index} value={choice}>
                  {choice}
                </MenuItem>
              );
            })}
          </Select>
        );
      case 'MULTIPLE':
        return (
          <FormGroup>
            {question.choices.map((choice, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    {...register(question.id.toString())}
                    value={choice}
                  />
                }
                label={choice}
              />
            ))}
          </FormGroup>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ width: '100%' }}>
        <Stack spacing={2}>
          {form.form.questions.map((question, index) => {
            return (
              <Item key={index}>
                <Box sx={{ width: '100%' }}>
                  <Stack spacing={2}>
                    <Card sx={{ minWidth: 275 }}>
                      <CardContent>
                        <Typography variant="h5" component="div">
                          {question.title}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                          {question.description}
                        </Typography>
                        <Typography variant="body2">
                          {generateInputSpace(question)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Stack>
                </Box>
              </Item>
            );
          })}
          <Item>
            <Button type="submit" variant="contained" endIcon={<SendIcon />}>
              送信
            </Button>
          </Item>
        </Stack>
      </Box>
    </form>
  );

  // type FormDataType = {
  //   [key: number]: NonEmptyArray<string>;
  // };

  // const [formData, setFormData] = React.useState<FormDataType>({});

  // const updateMultipleData = (e: any) => {
  //   assert(e.target.type == 'checkbox');

  //   if (formData[e.target.name]?.includes(e.target.value)) {
  //     setFormData({
  //       ...formData,
  //       [e.target.name]: formData[e.target.name]?.filter(
  //         (data) => data == e.target.value
  //       ),
  //     });
  //   } else if (formData[e.target.name] == undefined) {
  //     setFormData({
  //       ...formData,
  //       [e.target.name]: [e.target.value],
  //     });
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [e.target.name]: formData[e.target.name]?.concat(e.target.value),
  //     });
  //   }
  // };

  // const updateData = (e: any) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: [e.target.value],
  //   });
  // };

  // const handleSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
  //   e.preventDefault();
  //   console.log(formData);
  //   interface Answers {
  //     questionId: number;
  //   }
  //   Object.entries(formData).map(function ([key, value]) {});
  //   changeSendedState(true);
  // };

  // if (isSended) {
  //   return (
  //     <Box sx={{ width: '20%' }}>
  //       <Alert severity="success">
  //         <AlertTitle>Success</AlertTitle>
  //         回答を送信しました
  //       </Alert>
  //       <Stack
  //         direction="row"
  //         divider={<Divider orientation="vertical" flexItem />}
  //         spacing={2}
  //       >
  //         <Item>
  //           <Button variant="contained" onClick={unSend}>
  //             ← 別の回答をする
  //           </Button>
  //         </Item>
  //         <Item>
  //           <Link href="/forms">
  //             <Button variant="contained">フォーム一覧へ →</Button>
  //           </Link>
  //         </Item>
  //       </Stack>
  //     </Box>
  //   );
  // } else {
  //   return (
  //     <Box sx={{ width: '100%' }}>
  //       <Stack spacing={2}>
  //         {form.form.questions.map((question, index) => {
  //           switch (question.question_type) {
  //             case 'TEXT':
  //               return (
  //                 <Item key={index}>
  //                   <Card sx={{ minWidth: 275 }}>
  //                     <CardContent>
  //                       <Typography variant="h5" component="div">
  //                         {question.title}
  //                       </Typography>
  //                       <Typography sx={{ mb: 1.5 }} color="text.secondary">
  //                         {question.description}
  //                       </Typography>
  //                       <Typography variant="body2">
  //                         <Box
  //                           component="form"
  //                           sx={{
  //                             '& .MuiTextField-root': { m: 1, width: '25ch' },
  //                           }}
  //                           noValidate
  //                           autoComplete="off"
  //                         >
  //                           <TextField
  //                             id="outlined-multiline-static"
  //                             name={question.id.toString()}
  //                             label="回答を入力"
  //                             multiline
  //                             rows={4}
  //                             onChange={updateData}
  //                           />
  //                         </Box>
  //                       </Typography>
  //                     </CardContent>
  //                   </Card>
  //                 </Item>
  //               );
  //             case 'SINGLE':
  //               return (
  //                 <Item key={index}>
  //                   <Card sx={{ minWidth: 275 }}>
  //                     <CardContent>
  //                       <Typography variant="h5" component="div">
  //                         {question.title}
  //                       </Typography>
  //                       <Typography sx={{ mb: 1.5 }} color="text.secondary">
  //                         {question.description}
  //                       </Typography>
  //                       <Typography variant="body2">
  //                         <FormControl>
  //                           <RadioGroup
  //                             name={question.id.toString()}
  //                             defaultChecked
  //                           >
  //                             {question.choices.map((choice, index) => {
  //                               return (
  //                                 <FormControlLabel
  //                                   key={index}
  //                                   control={<Radio />}
  //                                   value={choice}
  //                                   label={choice}
  //                                   onChange={updateData}
  //                                 />
  //                               );
  //                             })}
  //                           </RadioGroup>
  //                         </FormControl>
  //                       </Typography>
  //                     </CardContent>
  //                   </Card>
  //                 </Item>
  //               );
  //             case 'MULTIPLE':
  //               return (
  //                 <Item key={index}>
  //                   <Card sx={{ minWidth: 275 }}>
  //                     <CardContent>
  //                       <Typography variant="h5" component="div">
  //                         {question.title}
  //                       </Typography>
  //                       <Typography sx={{ mb: 1.5 }} color="text.secondary">
  //                         {question.description}
  //                       </Typography>
  //                       <Typography variant="body2">
  //                         <FormGroup>
  //                           {question.choices.map((choice, index) => {
  //                             return (
  //                               <FormControlLabel
  //                                 key={index}
  //                                 control={<Checkbox />}
  //                                 name={question.id.toString()}
  //                                 label={choice}
  //                                 value={choice}
  //                                 onChange={updateMultipleData}
  //                               />
  //                             );
  //                           })}
  //                         </FormGroup>
  //                       </Typography>
  //                     </CardContent>
  //                   </Card>
  //                 </Item>
  //               );
  //           }
  //         })}
  //         <Button
  //           variant="contained"
  //           endIcon={<SendIcon />}
  //           onClick={handleSubmit}
  //         >
  //           送信
  //         </Button>
  //       </Stack>
  //     </Box>
  //   );
  // }
}
