import { Tab, Tabs } from '@mui/material';

import type { AnswerOpenState } from '@/lib/forms/answerStatus';

const AnswerOpenStateTabs = ({
  value,
  onChange,
}: {
  value: AnswerOpenState;
  onChange: (value: AnswerOpenState) => void;
}) => (
  <Tabs
    value={value}
    onChange={(_event, next: AnswerOpenState) => {
      onChange(next);
    }}
    sx={{ minHeight: 0 }}
  >
    <Tab
      label="未完了"
      value="open"
      sx={{ minHeight: 0, py: 1 }}
      aria-label="未完了の回答のみ表示"
    />
    <Tab
      label="完了"
      value="closed"
      sx={{ minHeight: 0, py: 1 }}
      aria-label="対応済みの回答のみ表示"
    />
  </Tabs>
);

export default AnswerOpenStateTabs;
