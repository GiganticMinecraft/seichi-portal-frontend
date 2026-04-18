'use client';

export const useCommentActions = () => {
  const sendComment = async (
    answerId: number | string,
    content: string
  ): Promise<{ ok: boolean }> => {
    const response = await fetch(`/api/proxy/forms/answers/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answer_id: Number(answerId),
        content,
      }),
    });
    return { ok: response.ok };
  };

  const deleteComment = async (commentId: number): Promise<{ ok: boolean }> => {
    const response = await fetch(
      `/api/proxy/forms/answers/comment/${commentId}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return { ok: response.ok };
  };

  return { sendComment, deleteComment };
};
