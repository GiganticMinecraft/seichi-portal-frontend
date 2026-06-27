'use client';

import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import ConversationComposer from './ConversationComposer';
import { useMessageConversationActions } from './useConversationActions';

const InputMessageField = (props: {
  form_id: string;
  answer_id: string;
  textFieldSx?: SxProps<Theme>;
}) => {
  const actions = useMessageConversationActions(props.form_id, props.answer_id);

  return (
    <Box
      sx={{
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <ConversationComposer
        label="メッセージを入力してください"
        helperText="Shift + Enter で改行、Enter で送信することができます。"
        onSend={actions.send}
        {...(props.textFieldSx ? { textFieldSx: props.textFieldSx } : {})}
      />
    </Box>
  );
};

export default InputMessageField;
