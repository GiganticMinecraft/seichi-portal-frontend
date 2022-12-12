/* eslint-disable react/jsx-props-no-spreading */
import {
  Textarea,
  Stack,
  Checkbox,
  Select,
  FormControl,
  Card,
  CardBody,
  FormLabel,
  Heading,
  Text,
} from '@chakra-ui/react';
import { UseFormRegister } from 'react-hook-form';

import { Question } from '../../types';

type Props = {
  questions: Question[];
  register: UseFormRegister<{ [key: string]: string | string[] }>;
};

export const Answer = ({ questions, register }: Props) => {
  const defineAnswerComponent = (q: Question) => {
    switch (q.type) {
      case 'TEXT':
        return <Textarea {...register(q.id.toString())} />;
      case 'CHECKBOX':
        return (
          <Stack spacing={5} direction="row">
            {q.choices?.map((choice, idx) => {
              const name = `${q.id}.choice-${idx}`;

              return (
                <Checkbox key={name} {...register(name)}>
                  {choice}
                </Checkbox>
              );
            })}
          </Stack>
        );
      case 'PULLDOWN':
        return (
          <Select placeholder="選択してください" {...register(q.id.toString())}>
            {q.choices?.map((choice, idx) => {
              const key = `${q.id}.option-${idx}`;

              return <option key={key}>{choice}</option>;
            })}
          </Select>
        );
      default:
        // TODO: throw error
        return <p>Unexpected Question Type.</p>;
    }
  };

  return (
    <>
      {questions.map((question) => (
        <FormControl key={question.id} my={4}>
          <Card>
            <CardBody>
              <FormLabel mb={2}>
                <Heading fontWeight="medium" fontSize="xl">
                  {question.title}
                </Heading>
              </FormLabel>
              <Text mb={5}>{question.description}</Text>
              {defineAnswerComponent(question)}
            </CardBody>
          </Card>
        </FormControl>
      ))}
    </>
  );
};
