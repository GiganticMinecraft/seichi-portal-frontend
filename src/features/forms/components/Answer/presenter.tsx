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
  Button,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { UseFormRegister } from 'react-hook-form';
import { FaArrowRight } from 'react-icons/fa';

import { Question } from '@/api/@types';

import { ClearForm, ClearFormProps } from '../ClearForm';

type AnswerFieldProps = {
  question: Question;
  register: UseFormRegister<{ [key: string]: string | string[] }>;
};

const AnswerField = ({ question: q, register }: AnswerFieldProps) => {
  switch (q.question_type) {
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

export type PresenterProps = {
  questions: Question[];
  onModalOpen: () => void;
  goToConfirm: () => void;
} & Pick<AnswerFieldProps, 'register'> &
  ClearFormProps;

export const Presenter = ({
  questions,
  register,
  onModalOpen,
  goToConfirm: onConfirm,
  ...clearFormProps
}: PresenterProps) => (
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
            <AnswerField {...{ question, register }} />
          </CardBody>
        </Card>
      </FormControl>
    ))}
    <Flex mt={6}>
      <Button
        colorScheme="blue"
        leftIcon={<FaArrowRight />}
        onClick={onConfirm}
      >
        内容を確認する
      </Button>
      <Spacer />
      <Button colorScheme="blue" variant="ghost" onClick={onModalOpen}>
        フォームをクリアする
      </Button>
      <ClearForm {...clearFormProps} />
    </Flex>
  </>
);
