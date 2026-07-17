import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import MarkdownText from '@/app/_components/MarkdownText';

import { renderWithProviders, screen, waitFor, within } from './render';

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

  describe('リンク偽装対策の確認ダイアログ', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('リンク文言と異なる遷移先を持つリンクをクリックすると、実際の遷移先を提示する確認ダイアログを表示し、既定では遷移しない', async () => {
      const user = userEvent.setup();
      const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);

      renderWithProviders(
        <MarkdownText>
          {'[https://example.com](https://evil.example/phishing)'}
        </MarkdownText>
      );

      await user.click(
        screen.getByRole('link', { name: 'https://example.com' })
      );

      const dialog = await screen.findByRole('dialog');
      expect(
        within(dialog).getByText('https://evil.example/phishing')
      ).toBeVisible();
      expect(openSpy).not.toHaveBeenCalled();
    });

    it('確認ダイアログで移動を選ぶと、実際の遷移先を新しいタブで開きダイアログを閉じる', async () => {
      const user = userEvent.setup();
      const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);

      renderWithProviders(
        <MarkdownText>{'[リンク](https://example.com/path)'}</MarkdownText>
      );

      await user.click(screen.getByRole('link', { name: 'リンク' }));
      const dialog = await screen.findByRole('dialog');
      await user.click(
        within(dialog).getByRole('button', { name: '移動する' })
      );

      expect(openSpy).toHaveBeenCalledWith(
        'https://example.com/path',
        '_blank',
        'noopener,noreferrer'
      );
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeNull();
      });
    });

    it('確認ダイアログでキャンセルを選ぶと、遷移せずダイアログを閉じる', async () => {
      const user = userEvent.setup();
      const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);

      renderWithProviders(
        <MarkdownText>{'[リンク](https://example.com/path)'}</MarkdownText>
      );

      await user.click(screen.getByRole('link', { name: 'リンク' }));
      const dialog = await screen.findByRole('dialog');
      await user.click(
        within(dialog).getByRole('button', { name: 'キャンセル' })
      );

      expect(openSpy).not.toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeNull();
      });
    });

    it.each([
      ['相対パス', '/dashboard'],
      ['ページ内アンカー', '#section-1'],
    ])(
      '同一オリジンへの内部リンク(%s)をクリックしても確認ダイアログは表示されない',
      async (_label, href) => {
        const user = userEvent.setup();

        renderWithProviders(<MarkdownText>{`[リンク](${href})`}</MarkdownText>);

        await user.click(screen.getByRole('link', { name: 'リンク' }));

        expect(screen.queryByRole('dialog')).toBeNull();
      }
    );
  });
});
