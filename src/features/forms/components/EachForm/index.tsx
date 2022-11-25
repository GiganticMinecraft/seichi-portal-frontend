import { useForm } from './hooks';
import { Presenter } from './presenter';

import { asFormId } from '../../types';

type Props = {
  formId: string;
};

export const EachForm = ({ formId }: Props) => {
  const form = useForm(asFormId(formId));

  return <Presenter {...{ form }} />;
};
