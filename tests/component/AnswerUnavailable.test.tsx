import { describe, expect, it } from 'vitest';

import AnswerUnavailable from '@/app/(protected)/_components/AnswerDetail/AnswerUnavailable';

import { renderWithProviders, screen } from './render';

describe('AnswerUnavailable', () => {
  it('管理者でアーカイブ済みフォームが分かるときは、フォーム名と復元の案内、アーカイブ済み一覧への導線を出す', () => {
    renderWithProviders(
      <AnswerUnavailable
        reason="form-not-found"
        isAdmin={true}
        archivedFormTitle="不具合報告フォーム"
      />
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'フォームが見つかりません',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'フォーム「不具合報告フォーム」はアーカイブされています。復元すると回答を表示できます。'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'アーカイブ済みフォーム一覧へ' })
    ).toHaveAttribute('href', '/admin/forms?tab=archived');
  });

  it('管理者でもアーカイブ済みフォームが取れなければ、フォーム一覧への導線になる', () => {
    renderWithProviders(
      <AnswerUnavailable reason="form-not-found" isAdmin={true} />
    );

    expect(
      screen.getByText('この回答のフォームはアーカイブまたは削除されました。')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'フォーム一覧へ' })
    ).toHaveAttribute('href', '/admin/forms');
  });

  it('一般ユーザーには自分の回答一覧への導線を出す', () => {
    renderWithProviders(
      <AnswerUnavailable reason="answer-not-found" isAdmin={false} />
    );

    expect(
      screen.getByRole('heading', { level: 1, name: '回答が見つかりません' })
    ).toBeInTheDocument();
    expect(screen.getByText('この回答は削除されました。')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '自分の回答一覧へ' })
    ).toHaveAttribute('href', '/answers');
  });
});
