/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Spacer,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { FieldValues, SubmitHandler, UseFormRegister } from 'react-hook-form';
import { FaRedo, FaArrowLeft } from 'react-icons/fa';

import { Alert } from '@/components/Alert';

import { Form, Question } from '../../types';
import { ClearForm, ClearFormProps } from '../ClearForm';

type Props<T extends FieldValues> = {
  register: UseFormRegister<{ [key: string]: string | string[] }>;
  form: Form;
  onSubmit: ReturnType<SubmitHandler<T>>;
  isSubmitting: boolean;
  isSubmitSuccessful: boolean;
  onModalOpen: () => void;
  onBackToFormsList: () => void;
  onSendAgein: () => void;
};

export const Presenter = <T extends FieldValues>({
  form,
  register,
  onSubmit,
  isSubmitting,
  isSubmitSuccessful,
  onModalOpen,
  onBackToFormsList,
  onSendAgein,
  ...clearFormProps
}: Props<T> & ClearFormProps) => (
  <>
    <Heading as="h2" size="lg" mb={2}>
      {form.title}
    </Heading>
    <Text mb={2}>{form.description}</Text>
    {isSubmitSuccessful ? (
      <>
        <Alert
          status="success"
          title="回答を送信しました"
          description="ご回答いただきありがとうございます。"
        />
        <Divider my={3} />
        <Stack
          spacing={4}
          justifyContent="center"
          direction={['column', 'row']}
        >
          <Button
            colorScheme="blue"
            leftIcon={<FaArrowLeft />}
            onClick={onBackToFormsList}
          >
            フォーム一覧に戻る
          </Button>
          <Button
            colorScheme="blue"
            leftIcon={<FaRedo />}
            variant="outline"
            onClick={onSendAgein}
          >
            別の回答を送信する
          </Button>
        </Stack>
      </>
    ) : (
      <form onSubmit={onSubmit}>
        {form.questions.map((question) => {
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
                  <Select
                    placeholder="選択してください"
                    {...register(q.id.toString())}
                  >
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
          );
        })}
        <Flex mt={6}>
          <Button colorScheme="blue" isLoading={isSubmitting} type="submit">
            送信する
          </Button>
          <Spacer />
          <Button colorScheme="blue" variant="ghost" onClick={onModalOpen}>
            フォームをクリアする
          </Button>
          <ClearForm {...clearFormProps} />
        </Flex>
      </form>
    )}
  </>
);
