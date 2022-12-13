import { useDisclosure } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

import { Presenter, PresenterProps } from './presenter';

type Props = Pick<PresenterProps, 'questions' | 'goToConfirm'>;

export const Answer = ({ questions, goToConfirm }: Props) => {
  const { register, reset: resetForm } = useFormContext();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  return (
    <Presenter
      {...{
        questions,
        register,
        resetForm,
        onModalOpen,
        onModalClose,
        isModalOpen,
        goToConfirm,
      }}
    />
  );
};
