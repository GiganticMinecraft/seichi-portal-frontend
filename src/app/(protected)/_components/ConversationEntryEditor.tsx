'use client';

import { TextField } from '@mui/material';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => Promise<void>;
};

// Esc によるキャンセルは、フォーカス位置に依存せず確実に検知するため
// 親の ConversationEntry 側で capture フェーズの onKeyDownCapture として処理する
// (#837 参照)。ここでは Enter による確定のみを扱う。
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
