import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Comments from '@/app/(protected)/_components/Comments';
import type { AnswerComment } from '@/lib/api-types';

import { renderWithProviders, screen } from './render';

const sendCommentMock = vi.hoisted(() => vi.fn());
const deleteCommentMock = vi.hoisted(() => vi.fn());

vi.mock('@/app/(protected)/_components/useConversationActions', () => ({
  useCommentConversationActions: () => ({
    send: sendCommentMock,
    deleteEntry: deleteCommentMock,
  }),
}));

const comments: AnswerComment[] = [
  {
    id: 'comment-uuid-1',
    content: 'はじめまして',
    commented_by: { name: 'Alice', role: 'STANDARD_USER', uuid: 'user-1' },
    timestamp: '2024-01-01T00:00:00Z',
  },
  {
    id: 'comment-uuid-2',
    content: 'よろしくお願いします',
    commented_by: { name: 'Bob', role: 'STANDARD_USER', uuid: 'user-2' },
    timestamp: '2024-01-02T00:00:00Z',
  },
];

describe('Comments', () => {
  it('commentId 直リンクが comment.id と一致する場合に drawer を自動的に開く', async () => {
    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId={undefined}
        showDeleteButton={undefined}
        deepLink={{ entryId: 'comment-uuid-2', onClose: vi.fn() }}
      />
    );

    expect(
      await screen.findByRole('heading', { name: 'コメント' })
    ).toBeVisible();
    expect(screen.getByText('よろしくお願いします')).toBeVisible();
  });

  it('commentId 直リンクが一致しない場合は、クラッシュせずエラー通知を表示する', async () => {
    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId={undefined}
        showDeleteButton={undefined}
        deepLink={{ entryId: 'no-such-comment', onClose: vi.fn() }}
      />
    );

    expect(
      await screen.findByText('指定されたコメントが見つかりませんでした。')
    ).toBeVisible();
    // drawer は自動的に開かない
    expect(
      screen.queryByRole('heading', { name: 'コメント' })
    ).not.toBeInTheDocument();
  });

  it('「その他の操作」メニューの「リンクをコピー」から、origin + パス + commentId 形式の絶対 URL をコピーでき、コピー後にフィードバックが表示される', async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockResolvedValue(undefined);

    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId={undefined}
        showDeleteButton={undefined}
        deepLink={{ entryId: undefined, onClose: vi.fn() }}
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`コメント \\(${comments.length}\\)`),
      })
    );

    const menuTriggers = await screen.findAllByRole('button', {
      name: 'その他の操作',
    });
    expect(menuTriggers).toHaveLength(comments.length);

    const secondCommentMenuTrigger = menuTriggers[1];
    if (secondCommentMenuTrigger === undefined) {
      throw new Error('2 件目のコメントの操作メニュー button が見つかりません');
    }
    await user.click(secondCommentMenuTrigger);

    await user.click(
      await screen.findByRole('menuitem', { name: 'リンクをコピー' })
    );

    expect(writeTextSpy).toHaveBeenCalledWith(
      `${window.location.origin}/?commentId=comment-uuid-2`
    );
    expect(await screen.findByText('リンクをコピーしました')).toBeVisible();
  });

  it('独立したコピーアイコンは表示されない(誤操作防止のため三点リーダーメニュー経由のみ)', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Comments
        comments={comments}
        formId="form-1"
        answerId="answer-1"
        currentUserId={undefined}
        showDeleteButton={undefined}
        deepLink={{ entryId: undefined, onClose: vi.fn() }}
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`コメント \\(${comments.length}\\)`),
      })
    );

    await screen.findAllByRole('button', { name: 'その他の操作' });
    expect(
      screen.queryByRole('button', { name: 'リンクをコピー' })
    ).not.toBeInTheDocument();
  });
});
