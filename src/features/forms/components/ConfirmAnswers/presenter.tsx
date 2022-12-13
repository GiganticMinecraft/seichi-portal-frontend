/* eslint-disable react/jsx-props-no-spreading */
import { Button, Divider, Stack } from '@chakra-ui/react';
import { FieldValues } from 'react-hook-form';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';

type Props<T extends FieldValues> = {
  values: T;
};

export type PresenterProps = {
  isSubmitting: boolean;
  backToAnswer: () => void;
};

export const Presenter = <T extends FieldValues>({
  isSubmitting,
  values,
  backToAnswer,
}: PresenterProps & Props<T>) => (
  <>
    <p>
      {
        // TODO: impl
        JSON.stringify(values)
      }
    </p>
    <Divider my={3} />
    <Stack spacing={4} justifyContent="center" direction={['column', 'row']}>
      <Button
        variant="outline"
        colorScheme="blue"
        leftIcon={<FaArrowLeft />}
        onClick={backToAnswer}
      >
        回答に戻る
      </Button>
      <Button
        colorScheme="blue"
        leftIcon={<FaCheck />}
        isLoading={isSubmitting}
        type="submit"
      >
        送信する
      </Button>
    </Stack>
  </>
);
