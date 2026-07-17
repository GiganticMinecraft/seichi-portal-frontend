'use client';

import { TextField } from '@mui/material';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => Promise<void>;
};

const ConversationEntryEditor = ({ value, onChange, onSubmit }: Props) => (
  <TextField
    autoFocus
    value={value}
    helperText="編集を確定するには Enter キー、キャンセルするには Esc キーを入力してください。"
    multiline
    fullWidth
    onChange={(event) => {
      onChange(event.target.value);
    }}
    onKeyDown={(event) => {
      if (
        event.key === 'Enter' &&
        !event.shiftKey &&
        !event.nativeEvent.isComposing
      ) {
        event.preventDefault();
        void onSubmit();
      }
    }}
  />
);

export default ConversationEntryEditor;
