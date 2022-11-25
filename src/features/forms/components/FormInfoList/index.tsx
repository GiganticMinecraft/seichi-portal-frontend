import { useFormInfoList } from './hooks';
import { Presenter } from './presenter';

export const FormInfoList = () => {
  const forms = useFormInfoList();

  return <Presenter {...{ forms }} />;
};
