import { useQuery } from '@tanstack/react-query';

import { getForm } from '../../services/getForm';
import { FormId } from '../../types';

export const useForm = (id: FormId) => {
  const { data } = useQuery([id, 'form'], () => getForm(id));

  return data;
};
