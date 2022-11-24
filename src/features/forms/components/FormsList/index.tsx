import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { Presenter } from './presenter';

import { getFormInfoList } from '../../services/getFormInfoList';

export const FormsList = () => {
  const router = useRouter();
  const { data: forms = [] } = useQuery(['formInfoList'], () =>
    getFormInfoList(),
  );

  return (
    <Presenter
      {...{ forms }}
      onClick={(id) =>
        router.push({ pathname: '/forms/[id]', query: { id: id.toString() } })
      }
    />
  );
};
