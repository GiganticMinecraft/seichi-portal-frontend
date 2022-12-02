/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { FieldValues, SubmitHandler, UseFormRegister } from 'react-hook-form';

import { Form, Question } from '../../types';

type Props<T extends FieldValues> = {
  register: UseFormRegister<{ [key: string]: string | string[] }>;
  form: Form;
  onSubmit: ReturnType<SubmitHandler<T>>;
  isSubmitting: boolean;
};

export const Presenter = <T extends FieldValues>({
  form,
  register,
  onSubmit,
  isSubmitting,
}: Props<T>) => (
  <>
    <Heading as="h2" size="lg" mb={2}>
      {form.title}
    </Heading>
    <Text mb={2}>{form.description}</Text>
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
          <FormControl key={question.id} mb={2}>
            <FormLabel mb={2}>{question.title}</FormLabel>
            {defineAnswerComponent(question)}
          </FormControl>
        );
      })}
      <Button mt={4} isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  </>
);
