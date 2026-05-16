'use client';

import { TextField } from '@mui/material';

type Props = {
  defaultValue: string;
  onChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
};

const ConversationEntryEditor = ({
  defaultValue,
  onChange,
  onSubmit,
  onCancel,
}: Props) => (
  <TextField
    defaultValue={defaultValue}
    helperText="編集を確定するには Enter キー、キャンセルするには Esc キーを入力してください。"
    multiline
    fullWidth
    onChange={(event) => onChange(event.target.value)}
    onKeyDown={async (event) => {
      if (
        event.key === 'Enter' &&
        !event.shiftKey &&
        !event.nativeEvent.isComposing
      ) {
        event.preventDefault();
        await onSubmit();
      } else if (event.key === 'Escape') {
        onCancel();
      }
    }}
  />
);

export default ConversationEntryEditor;
