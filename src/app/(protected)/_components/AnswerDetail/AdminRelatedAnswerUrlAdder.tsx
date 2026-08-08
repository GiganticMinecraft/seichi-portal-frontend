'use client';

import AddIcon from '@mui/icons-material/Add';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';

import SnackbarAlert, { useSnackbar } from '@/app/_components/SnackbarAlert';
import { useRelatedAnswerActions } from '@/hooks/useRelatedAnswerActions';

const ANSWER_URL_PATTERN = /\/forms\/([^/?#]+)\/answers\/([^/?#]+)/;

const parseAnswerUrl = (
  input: string
): { formId: string; answerId: string } | null => {
  const match = ANSWER_URL_PATTERN.exec(input.trim());
  const formId = match?.[1];
  const answerId = match?.[2];
  if (!formId || !answerId) {
    return null;
  }
  return { formId, answerId };
};

const AdminRelatedAnswerUrlAdder = ({
  formId,
  answerId,
  excludedAnswerIds,
}: {
  formId: string;
  answerId: string;
  excludedAnswerIds: string[];
}) => {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
  const { addRelatedAnswer } = useRelatedAnswerActions(formId, answerId);

  const handleSubmit = async () => {
    const parsed = parseAnswerUrl(url);
    if (!parsed) {
      showSnackbar(
        '回答の詳細ページのURLを正しく貼り付けてください。',
        'error'
      );
      return;
    }
    if (parsed.answerId === answerId) {
      showSnackbar('自分自身を関連付けることはできません。', 'error');
      return;
    }
    if (excludedAnswerIds.includes(parsed.answerId)) {
      showSnackbar('この回答は既に関連付けられています。', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = await addRelatedAnswer(parsed.formId, parsed.answerId);
    setIsSubmitting(false);

    if (result.ok) {
      setUrl('');
    } else if (result.forbidden) {
      showSnackbar('関連付けを追加する権限がありません。', 'error');
    } else {
      showSnackbar(
        '追加に失敗しました。URLが正しいかご確認ください。',
        'error'
      );
    }
  };

  return (
    <>
      <TextField
        label="回答のURLを貼り付けて追加"
        size="small"
        value={url}
        onChange={(event) => {
          setUrl(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !isSubmitting) {
            event.preventDefault();
            void handleSubmit();
          }
        }}
        disabled={isSubmitting}
        sx={{ minWidth: 280 }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="追加"
                  size="small"
                  disabled={isSubmitting || url.trim() === ''}
                  onClick={() => {
                    void handleSubmit();
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />
    </>
  );
};

export default AdminRelatedAnswerUrlAdder;
