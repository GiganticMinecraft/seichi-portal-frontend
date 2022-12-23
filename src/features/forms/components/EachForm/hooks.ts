import { useQuery } from '@tanstack/react-query';

import { getForm } from '../../services/getForm';

export const useForm = (id: number) =>
  useQuery([id, 'form'], () => getForm(id)).data;
