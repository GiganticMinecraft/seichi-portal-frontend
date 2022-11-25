import { Form } from '../../types';

type Props = {
  form?: Form;
};

export const Presenter = ({ form }: Props) => <p>{form?.title}</p>;
