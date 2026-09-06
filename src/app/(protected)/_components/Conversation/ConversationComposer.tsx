'use client';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Chip,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { DragEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { formatFileSize } from '@/generic/FileSizeFormatter';

import {
  MAX_COMMENT_ATTACHMENT_SIZE_BYTES,
  MAX_COMMENT_ATTACHMENTS_PER_COMMENT,
} from './commentAttachmentLimits';
import type { ConversationActionResult } from './conversationTypes';

type ComposerForm = {
  body: string;
};

type Props = {
  label: string;
  onSend: (body: string, files?: File[]) => Promise<ConversationActionResult>;
  textFieldSx?: SxProps<Theme>;
  /** true のとき、ファイルの選択・ドラッグ&ドロップによる添付を有効にする。 */
  attachmentsEnabled?: boolean;
};

/**
 * 投稿入力フォームを共通化する component。
 * Enter / Shift+Enter の送信体験と送信エラー表示をここで統一する。
 */
const ConversationComposer = ({
  label,
  onSend,
  textFieldSx,
  attachmentsEnabled = false,
}: Props) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm<ComposerForm>();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'warning';
  }>({ open: false, message: '', severity: 'error' });
  const [files, setFiles] = useState<File[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shouldRefocusRef = useRef(false);
  const { ref: registerRef, ...bodyRegister } = register('body');

  useEffect(() => {
    if (!isSubmitting && shouldRefocusRef.current) {
      shouldRefocusRef.current = false;
      inputRef.current?.focus();
    }
  }, [isSubmitting]);

  const showMessage = (message: string, severity: 'error' | 'warning') => {
    setSnackbar({ open: true, message, severity });
  };

  const addFiles = (candidates: File[]) => {
    if (candidates.length === 0) {
      return;
    }

    if (
      files.length + candidates.length >
      MAX_COMMENT_ATTACHMENTS_PER_COMMENT
    ) {
      showMessage(
        `1 件のコメントに添付できるファイルは ${MAX_COMMENT_ATTACHMENTS_PER_COMMENT} 個までです。`,
        'error'
      );
      return;
    }

    const oversizedFile = candidates.find(
      (file) => file.size > MAX_COMMENT_ATTACHMENT_SIZE_BYTES
    );
    if (oversizedFile) {
      showMessage(
        `${oversizedFile.name} は上限の ${formatFileSize(MAX_COMMENT_ATTACHMENT_SIZE_BYTES)} を超えています。`,
        'error'
      );
      return;
    }

    setFiles((prev) => [...prev, ...candidates]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ComposerForm) => {
    if (data.body === '') {
      return;
    }

    const result = await onSend(data.body, files);

    if (result.success) {
      reset({ body: '' });
      setFiles([]);
      shouldRefocusRef.current = true;
      if (result.attachmentsFailed) {
        showMessage(
          '投稿は送信されましたが、ファイルの添付に失敗しました。',
          'warning'
        );
      }
    } else if (result.forbidden) {
      showMessage('このメッセージを送信する権限がありません。', 'error');
    } else {
      showMessage('送信に失敗しました。', 'error');
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
        {...(attachmentsEnabled
          ? {
              onDragOver: (event: DragEvent<HTMLFormElement>) => {
                event.preventDefault();
                setIsDraggingOver(true);
              },
              onDragLeave: () => {
                setIsDraggingOver(false);
              },
              onDrop: (event: DragEvent<HTMLFormElement>) => {
                event.preventDefault();
                setIsDraggingOver(false);
                addFiles(Array.from(event.dataTransfer.files));
              },
            }
          : {})}
      >
        <Stack
          spacing={1}
          sx={{
            ...(isDraggingOver && {
              outline: (theme) => `2px dashed ${theme.palette.primary.main}`,
              outlineOffset: 4,
              borderRadius: 1,
            }),
          }}
        >
          {files.length > 0 && (
            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: 'wrap', rowGap: 1 }}
            >
              {files.map((file, index) => (
                <Chip
                  key={`${file.name}-${index}`}
                  label={`${file.name} (${formatFileSize(file.size)})`}
                  onDelete={() => {
                    handleRemoveFile(index);
                  }}
                  disabled={isSubmitting}
                />
              ))}
            </Stack>
          )}
          <TextField
            {...bodyRegister}
            inputRef={(
              element: HTMLInputElement | HTMLTextAreaElement | null
            ) => {
              inputRef.current = element;
              registerRef(element);
            }}
            autoFocus
            helperText={
              attachmentsEnabled
                ? 'Shift + Enter で改行、Enter で送信することができます。Markdown に対応しています。ファイルはドラッグ&ドロップでも添付できます。'
                : 'Shift + Enter で改行、Enter で送信することができます。Markdown に対応しています。'
            }
            disabled={isSubmitting}
            sx={
              textFieldSx
                ? [{ width: '100%' }, textFieldSx].flat()
                : { width: '100%' }
            }
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                if (isSubmitting) {
                  return;
                }
                void handleSubmit(onSubmit)();
              }
            }}
            slotProps={{
              input: {
                inputProps: { placeholder: label },
                endAdornment: (
                  <InputAdornment position="end">
                    {attachmentsEnabled && (
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          hidden
                          onChange={(event) => {
                            addFiles(Array.from(event.target.files ?? []));
                            event.target.value = '';
                          }}
                        />
                        <IconButton
                          aria-label="ファイルを添付"
                          disabled={isSubmitting}
                          onClick={() => {
                            fileInputRef.current?.click();
                          }}
                        >
                          <AttachFileIcon />
                        </IconButton>
                      </>
                    )}
                    <IconButton
                      type="submit"
                      aria-label="送信"
                      disabled={isSubmitting}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            multiline
          />
        </Stack>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => {
          setSnackbar((prev) => ({ ...prev, open: false }));
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => {
            setSnackbar((prev) => ({ ...prev, open: false }));
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ConversationComposer;
