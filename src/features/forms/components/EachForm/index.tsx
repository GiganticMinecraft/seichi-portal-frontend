import { useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { useForm as fetchForm } from './hooks';
import { Presenter } from './presenter';

import { asFormId } from '../../types';

export const EachForm = () => {
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const {
    reset: resetForm,
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm();
  const { query } = useRouter();
  const form = fetchForm(asFormId(query.id));
  if (!form) return null;
  const onSubmit = handleSubmit(async (data) => {
    // TODO: impl
    alert(JSON.stringify(data, null, 2));
    resetForm();
  });

  return (
    <Presenter
      {...{
        form,
        register,
        onSubmit,
        isSubmitting,
        isSubmitSuccessful,
        isModalOpen,
        onModalOpen,
        onModalClose,
        resetForm,
      }}
    />
  );
};
