import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ConversationEntryViewModel } from '@/app/(protected)/_components/conversationTypes';
import { useConversationEntryDeepLink } from '@/app/(protected)/_components/useConversationEntryDeepLink';

const makeEntry = (id: string): ConversationEntryViewModel => ({
  id,
  body: 'body',
  authorName: 'author',
  authorRole: 'USER',
  timestamp: '2024-01-01T00:00:00Z',
  renderMode: 'plain',
  canDelete: false,
  canEdit: false,
});

describe('useConversationEntryDeepLink', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('一致する entry があれば自動オープンし、対象 entry をハイライトする', () => {
    const onClose = vi.fn();

    const { result } = renderHook(() =>
      useConversationEntryDeepLink(
        { entryId: 'target', onClose },
        [makeEntry('target'), makeEntry('other')],
        'メッセージ'
      )
    );

    expect(result.current.autoOpen).toBe(true);
    expect(result.current.highlightedEntryId).toBe('target');
    expect(result.current.notFoundMessage).toBeUndefined();
  });

  it('一致する entry がなければ notFoundMessage を設定し、自動オープンはしない', () => {
    const onClose = vi.fn();

    const { result } = renderHook(() =>
      useConversationEntryDeepLink(
        { entryId: 'missing', onClose },
        [makeEntry('other')],
        'コメント'
      )
    );

    expect(result.current.autoOpen).toBe(false);
    expect(result.current.highlightedEntryId).toBeUndefined();
    expect(result.current.notFoundMessage).toBe(
      '指定されたコメントが見つかりませんでした。'
    );
  });

  // refreshInterval: 1000 により entries は毎回新しい参照になる。
  // 一度解決した後は、entries の中身が変わっても再解決してはならない
  // (でなければ、ユーザーが閉じた drawer が再フェッチのたびに開き直ってしまう)。
  it('一度解決した後は、entries が変化しても再解決しない(見つからない→見つかる)', () => {
    const onClose = vi.fn();

    const { result, rerender } = renderHook(
      ({ entries }: { entries: ConversationEntryViewModel[] }) =>
        useConversationEntryDeepLink(
          { entryId: 'late-arrival', onClose },
          entries,
          'メッセージ'
        ),
      { initialProps: { entries: [makeEntry('other')] } }
    );

    expect(result.current.notFoundMessage).toBe(
      '指定されたメッセージが見つかりませんでした。'
    );

    // 再フェッチにより対象 entry が entries に現れても、一度 not-found と解決済みなら
    // 状態は変化しない(自動オープンへ後追いで切り替わったりしない)。
    rerender({ entries: [makeEntry('late-arrival'), makeEntry('other')] });

    expect(result.current.autoOpen).toBe(false);
    expect(result.current.highlightedEntryId).toBeUndefined();
    expect(result.current.notFoundMessage).toBe(
      '指定されたメッセージが見つかりませんでした。'
    );
  });

  it('一度解決した後は、entries が変化しても再解決しない(見つかる→見つからない)', () => {
    const onClose = vi.fn();

    const { result, rerender } = renderHook(
      ({ entries }: { entries: ConversationEntryViewModel[] }) =>
        useConversationEntryDeepLink(
          { entryId: 'target', onClose },
          entries,
          'メッセージ'
        ),
      { initialProps: { entries: [makeEntry('target')] } }
    );

    expect(result.current.autoOpen).toBe(true);
    expect(result.current.highlightedEntryId).toBe('target');

    // 対象 entry が再フェッチ後に消えても(削除など)、既に解決済みの状態は保たれる。
    rerender({ entries: [makeEntry('other')] });

    expect(result.current.autoOpen).toBe(true);
    expect(result.current.highlightedEntryId).toBe('target');
    expect(result.current.notFoundMessage).toBeUndefined();
  });

  // entryId 自体が別の値に変わった場合(同一ページ内で別の直リンクに切り替わる、
  // ブラウザの戻る操作でクエリが変わる、など)は、たとえ一度解決済みでも
  // 新しい entryId に対して改めて解決し直す必要がある。
  it('entryId が別の値に変わった場合は、再度解決し直す(a→b)', () => {
    const onClose = vi.fn();

    const { result, rerender } = renderHook(
      ({ entryId }: { entryId: string }) =>
        useConversationEntryDeepLink(
          { entryId, onClose },
          [makeEntry('a'), makeEntry('b')],
          'メッセージ'
        ),
      { initialProps: { entryId: 'a' } }
    );

    expect(result.current.autoOpen).toBe(true);
    expect(result.current.highlightedEntryId).toBe('a');

    rerender({ entryId: 'b' });

    expect(result.current.autoOpen).toBe(true);
    expect(result.current.highlightedEntryId).toBe('b');
    expect(result.current.notFoundMessage).toBeUndefined();
  });

  it('entryId が undefined から別の値に変わった場合も解決し直す', () => {
    const onClose = vi.fn();
    const initialProps: { entryId: string | undefined } = {
      entryId: undefined,
    };

    const { result, rerender } = renderHook(
      ({ entryId }: { entryId: string | undefined }) =>
        useConversationEntryDeepLink(
          { entryId, onClose },
          [makeEntry('b')],
          'メッセージ'
        ),
      { initialProps }
    );

    expect(result.current.autoOpen).toBe(false);
    expect(result.current.highlightedEntryId).toBeUndefined();

    rerender({ entryId: 'b' });

    expect(result.current.autoOpen).toBe(true);
    expect(result.current.highlightedEntryId).toBe('b');
  });

  it('ハイライトは一定時間後に自動的に解除される', () => {
    const onClose = vi.fn();

    const { result } = renderHook(() =>
      useConversationEntryDeepLink(
        { entryId: 'target', onClose },
        [makeEntry('target')],
        'メッセージ'
      )
    );

    expect(result.current.highlightedEntryId).toBe('target');

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.highlightedEntryId).toBeUndefined();
  });

  it('dismissNotFoundMessage でエラーメッセージを消せる', () => {
    const onClose = vi.fn();

    const { result } = renderHook(() =>
      useConversationEntryDeepLink(
        { entryId: 'missing', onClose },
        [makeEntry('other')],
        'メッセージ'
      )
    );

    expect(result.current.notFoundMessage).toBeDefined();

    act(() => {
      result.current.dismissNotFoundMessage();
    });

    expect(result.current.notFoundMessage).toBeUndefined();
  });
});
