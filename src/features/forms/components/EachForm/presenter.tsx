/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import {
  FieldValues,
  SubmitHandler,
  UseFormRegister,
  UseFormReset,
} from 'react-hook-form';

import { Alert } from '@/components/Alert';

import { Form, Question } from '../../types';

type Props<T extends FieldValues> = {
  register: UseFormRegister<{ [key: string]: string | string[] }>;
  reset: UseFormReset<T>;
  form: Form;
  onSubmit: ReturnType<SubmitHandler<T>>;
  isSubmitting: boolean;
  isSubmitSuccessful: boolean;
  isModalOpen: boolean;
  onModalOpen: () => void;
  onModalClose: () => void;
};

export const Presenter = <T extends FieldValues>({
  form,
  register,
  reset,
  onSubmit,
  isSubmitting,
  isSubmitSuccessful,
  isModalOpen,
  onModalOpen,
  onModalClose,
}: Props<T>) => (
  <>
    <Heading as="h2" size="lg" mb={2}>
      {form.title}
    </Heading>
    <Text mb={2}>{form.description}</Text>
    {isSubmitSuccessful ? (
      <Alert
        status="success"
        title="回答を送信しました"
        description="ご回答いただきありがとうございます。"
      />
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
                    {q.choices?.map((choice, idx) => (
                      <Checkbox {...register(`${q.id}.choice-${idx}`)}>
                        {choice}
                      </Checkbox>
                    ))}
                  </Stack>
                );
              case 'PULLDOWN':
                return (
                  <Select
                    placeholder="選択してください"
                    {...register(q.id.toString())}
                  >
                    {q.choices?.map((choice) => (
                      <option>{choice}</option>
                    ))}
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
          <Modal isCentered isOpen={isModalOpen} onClose={onModalClose}>
            <ModalOverlay />
            <ModalContent mx="auto">
              <ModalHeader>フォームをクリアしますか？</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  すべての質問から回答が削除されます。元に戻すことはできません。
                </Text>
              </ModalBody>
              <ModalFooter
                display="grid"
                w="fit-content"
                mx="auto"
                gridAutoFlow="column"
                gridAutoColumns="1fr"
              >
                <Button colorScheme="blue" mr={3} onClick={onModalClose}>
                  キャンセル
                </Button>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    reset();
                    onModalClose();
                  }}
                >
                  フォームをクリアする
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      </form>
    )}
  </>
);
