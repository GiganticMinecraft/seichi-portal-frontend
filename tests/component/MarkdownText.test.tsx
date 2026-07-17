import { describe, expect, it } from 'vitest';

import MarkdownText from '@/app/_components/MarkdownText';

import { renderWithProviders, screen } from './render';

describe('MarkdownText', () => {
  it('Markdown 記法(強調・箇条書き)を実際の HTML 要素として描画する', () => {
    renderWithProviders(
      <MarkdownText>{'**太字**\n\n- 項目1\n- 項目2'}</MarkdownText>
    );

    const strong = screen.getByText('太字');
    expect(strong.tagName).toBe('STRONG');
    expect(screen.getByRole('list')).toBeVisible();
    expect(screen.getByText('項目1')).toBeVisible();
  });

  it('画像記法があっても img 要素を描画せず、alt テキストだけを表示する(トラッキングピクセル対策)', () => {
    const { container } = renderWithProviders(
      <MarkdownText>
        {'![説明文](https://example.com/tracker.png)'}
      </MarkdownText>
    );

    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(screen.getByText('[image: 説明文]')).toBeVisible();
  });

  it('alt テキストが空の画像記法では [image] とだけ表示する', () => {
    const { container } = renderWithProviders(
      <MarkdownText>{'![](https://example.com/tracker.png)'}</MarkdownText>
    );

    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(screen.getByText('[image]')).toBeVisible();
  });

  it('リンクは tabnabbing 対策として新しいタブで開く', () => {
    renderWithProviders(
      <MarkdownText>{'[リンク](https://example.com)'}</MarkdownText>
    );

    const link = screen.getByRole('link', { name: 'リンク' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
