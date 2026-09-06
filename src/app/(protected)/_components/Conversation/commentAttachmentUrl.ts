/** コメント添付ファイルのダウンロード URL を組み立てる。 */
export const getCommentAttachmentUrl = (
  formId: string,
  answerId: string,
  attachmentId: string
): string =>
  `/api/proxy/api/v1/forms/${encodeURIComponent(formId)}/answers/${encodeURIComponent(answerId)}/comments/attachments/${encodeURIComponent(attachmentId)}`;
