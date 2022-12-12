import { Button, Divider, Stack } from '@chakra-ui/react';
import { FaArrowLeft, FaRedo } from 'react-icons/fa';

import { Alert } from '@/components/Alert';

type Props = {
  onBackToFormsList: () => void;
  onSendAgain: () => void;
};

export const AnswerCompleted = ({ onBackToFormsList, onSendAgain }: Props) => (
  <>
    <Alert
      status="success"
      title="回答を送信しました"
      description="ご回答いただきありがとうございます。"
    />
    <Divider my={3} />
    <Stack spacing={4} justifyContent="center" direction={['column', 'row']}>
      <Button
        colorScheme="blue"
        leftIcon={<FaArrowLeft />}
        onClick={onBackToFormsList}
      >
        フォーム一覧に戻る
      </Button>
      <Button
        colorScheme="blue"
        leftIcon={<FaRedo />}
        variant="outline"
        onClick={onSendAgain}
      >
        別の回答を送信する
      </Button>
    </Stack>
  </>
);
