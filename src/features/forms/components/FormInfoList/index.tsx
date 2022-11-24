import { useRouter } from 'next/router';

import { useFormInfoList } from './hooks';
import { Presenter } from './presenter';

export const FormInfoList = () => {
  const router = useRouter();
  const forms = useFormInfoList();

  return (
    <Presenter
      {...{ forms }}
      onClick={(id) =>
        router.push({ pathname: '/forms/[id]', query: { id: id.toString() } })
      }
    />
  );
};
