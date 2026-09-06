'use client';

import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Chip, Paper, Stack, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';

import MarkdownText from '@/app/_components/MarkdownText';
import { formatFileSize } from '@/generic/FileSizeFormatter';

import type { ConversationEntryViewModel } from './conversationTypes';

type Props = {
  entry: ConversationEntryViewModel;
  /** true のとき、添付ファイルの削除操作を表示する。 */
  canManageAttachments?: boolean;
  onDeleteAttachment?: (attachmentId: string) => void | Promise<void>;
};

const ConversationEntryBody = ({
  entry,
  canManageAttachments = false,
  onDeleteAttachment,
}: Props) => {
  const isAdmin = entry.authorRole === 'ADMINISTRATOR';
  const attachments = entry.attachments ?? [];

  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        p: 1.5,
        backgroundColor: isAdmin
          ? alpha(theme.palette.success.main, 0.08)
          : theme.palette.grey[50],
        borderRadius: 2,
        boxShadow: 'none',
        ...(!isAdmin &&
          theme.applyStyles('dark', {
            backgroundColor: '#122131',
          })),
      })}
    >
      <MarkdownText>{entry.body}</MarkdownText>

      {attachments.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ flexWrap: 'wrap', rowGap: 1, mt: 1 }}
        >
          {attachments.map((attachment) => (
            <Chip
              key={attachment.id}
              icon={<InsertDriveFileIcon />}
              component="a"
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              clickable
              label={`${attachment.fileName} (${formatFileSize(attachment.size)})`}
              onDelete={
                canManageAttachments && onDeleteAttachment
                  ? () => {
                      void onDeleteAttachment(attachment.id);
                    }
                  : undefined
              }
              deleteIcon={
                <Tooltip title="添付ファイルを削除">
                  <CloseIcon />
                </Tooltip>
              }
            />
          ))}
        </Stack>
      )}
    </Paper>
  );
};

export default ConversationEntryBody;
