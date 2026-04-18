'use client';

export const useCommentActions = () => {
  const sendComment = async (answerId: number | string, content: string) => {
    await fetch(`/api/proxy/forms/answers/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answer_id: Number(answerId),
        content,
      }),
    });
  };

  const deleteComment = async (commentId: number) => {
    await fetch(`/api/proxy/forms/answers/comment/${commentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  };

  return { sendComment, deleteComment };
};
