/* eslint-disable react/jsx-props-no-spreading */
import { Heading, Text } from '@chakra-ui/react';
import {
  FieldValues,
  FormProvider,
  UseFormHandleSubmit,
  UseFormReturn,
} from 'react-hook-form';

import { Form, Question } from '../../types';
import { Answer } from '../Answer';
import { AnswerCompleted } from '../AnswerCompleted';
import { ConfirmAnswers } from '../ConfirmAnswers';

type FormContentsProps = {
  isConfirming: boolean;
  setIsConfirming: (isConfirming: boolean) => void;
  isSubmitSuccessful: boolean;
  questions: Question[];
};

const FormContents = ({
  isConfirming,
  setIsConfirming,
  isSubmitSuccessful,
  questions,
}: FormContentsProps) => {
  const backToAnswer = () => {
    setIsConfirming(false);
  };
  const goToConfirm = () => {
    setIsConfirming(true);
  };

  if (isSubmitSuccessful) return <AnswerCompleted />;
  if (isConfirming) return <ConfirmAnswers {...{ backToAnswer }} />;

  return <Answer {...{ questions, goToConfirm }} />;
};

type Props<T extends FieldValues> = {
  form: Form;
  methods: UseFormReturn;
  onSubmit: ReturnType<UseFormHandleSubmit<T>>;
} & Pick<FormContentsProps, 'isConfirming' | 'setIsConfirming'>;

export const Presenter = <T extends FieldValues>({
  form,
  methods,
  onSubmit,
  isConfirming,
  setIsConfirming,
}: Props<T>) => {
  const { questions } = form;
  const {
    formState: { isSubmitSuccessful },
  } = methods;

  return (
    <>
      <Heading as="h2" size="lg" mb={2}>
        {form.formName}
      </Heading>
      <Text mb={2}>{form.description}</Text>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <FormContents
            {...{
              questions,
              isConfirming,
              isSubmitSuccessful,
              setIsConfirming,
            }}
          />
        </form>
      </FormProvider>
    </>
  );
};
