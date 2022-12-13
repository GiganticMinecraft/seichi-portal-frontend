import { useRouter } from 'next/router';

import { Presenter } from './presenter';

export const AnswerCompleted = () => {
  const router = useRouter();
  const onBackToFormsList = () => {
    router.push('/forms');
  };
  const onSendAgain = () => {
    router.reload();
  };

  return <Presenter {...{ onBackToFormsList, onSendAgain }} />;
};
