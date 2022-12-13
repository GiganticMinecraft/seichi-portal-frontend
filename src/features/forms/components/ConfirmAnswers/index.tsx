import { useFormContext } from 'react-hook-form';

import { Presenter, PresenterProps } from './presenter';

type Props = Pick<PresenterProps, 'backToAnswer'>;

export const ConfirmAnswers = ({ backToAnswer }: Props) => {
  const {
    getValues,
    formState: { isSubmitting },
  } = useFormContext();
  const values = getValues();

  return <Presenter {...{ isSubmitting, values, backToAnswer }} />;
};
