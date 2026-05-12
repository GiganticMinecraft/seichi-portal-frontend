'use client';

import { useApiQuery } from '@/app/_swr/useApiQuery';
import LoadingCircular from '@/app/_components/LoadingCircular';
import DataTable from './_components/Dashboard';
import ErrorModal from '../../_components/ErrorModal';
import { usePageTitle } from '@/hooks/usePageTitle';

const Home = () => {
  usePageTitle('管理ダッシュボード');
  const {
    data: answers,
    error: answersError,
    isLoading,
  } = useApiQuery('/forms/answers');

  const {
    data: forms,
    error: formsError,
    isLoading: isLoadingForms,
  } = useApiQuery('/forms');

  if (answersError || formsError) {
    return <ErrorModal />;
  }

  if (isLoading || isLoadingForms || !answers || !forms) {
    return <LoadingCircular />;
  }

  return (
    <DataTable
      answerResponseWithFormTitle={answers.map((answer) => {
        return {
          ...answer,
          form_title:
            forms.find((form) => form.id === answer.form_id)?.title ??
            'unknown form',
        };
      })}
    />
  );
};

export default Home;
