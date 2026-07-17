export const UNSET_ANSWER_TITLE = '(タイトル未設定)';

export const resolveAnswerTitle = (title: string | null | undefined): string =>
  title && title.trim() !== '' ? title : UNSET_ANSWER_TITLE;
