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

export type ClearFormProps = {
  isModalOpen: boolean;
  onModalClose: () => void;
  resetForm: () => void;
};

export const ClearForm = ({
  isModalOpen,
  onModalClose,
  resetForm,
}: ClearFormProps) => (
  <Modal isCentered isOpen={isModalOpen} onClose={onModalClose}>
    <ModalOverlay />
    <ModalContent mx="auto">
      <ModalHeader>フォームをクリアしますか？</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text>
          すべての質問から回答が削除されます。元に戻すことはできません。
        </Text>
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
          }}
        >
          フォームをクリアする
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
