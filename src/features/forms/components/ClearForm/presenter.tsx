import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Button,
} from '@chakra-ui/react';

export type PresenterProps = {
  isModalOpen: boolean;
  onModalClose: () => void;
  resetForm: () => void;
  showToast: () => void;
};

export const Presenter = ({
  isModalOpen,
  onModalClose,
  resetForm,
  showToast,
}: PresenterProps) => (
  <Modal isCentered isOpen={isModalOpen} onClose={onModalClose}>
    <ModalOverlay />
    <ModalContent mx="auto">
      <ModalHeader>フォームをクリアしますか？</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text>すべての回答がクリアされます。元に戻すことはできません。</Text>
      </ModalBody>
      <ModalFooter
        display="grid"
        w="fit-content"
        mx="auto"
        gridAutoFlow="column"
        gridAutoColumns="1fr"
      >
        <Button colorScheme="blue" mr={3} onClick={onModalClose}>
          キャンセル
        </Button>
        <Button
          colorScheme="red"
          variant="outline"
          onClick={() => {
            resetForm();
            onModalClose();
            showToast();
          }}
        >
          フォームをクリアする
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
