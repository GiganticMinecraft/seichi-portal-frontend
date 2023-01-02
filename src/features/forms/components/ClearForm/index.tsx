import { useToast } from '@chakra-ui/react';

import { Presenter, PresenterProps } from './presenter';

export type ClearFormProps = Omit<PresenterProps, 'showToast'>;

export const ClearForm = ({
  isModalOpen,
  onModalClose,
  resetForm,
}: ClearFormProps) => {
  const toast = useToast();
  const showToast = () => {
    toast({
      title: 'フォームをクリアしました',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return <Presenter {...{ showToast, isModalOpen, onModalClose, resetForm }} />;
};
