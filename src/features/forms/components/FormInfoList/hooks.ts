import { useQuery } from '@tanstack/react-query';

import { getFormInfoList } from '../../services/getFormInfoList';

export const useFormInfoList = () => {
  const { data = [] } = useQuery(['formInfoList'], () => getFormInfoList());

  return data;
};
