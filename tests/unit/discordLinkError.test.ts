import { describe, expect, it } from 'vitest';

import {
  DISCORD_LINK_ERROR_ALREADY_LINKED,
  resolveDiscordLinkErrorMessage,
} from '@/lib/discordLinkError';

describe('resolveDiscordLinkErrorMessage', () => {
  it('許可リストにある値は文言に変換する', () => {
    expect(
      resolveDiscordLinkErrorMessage(DISCORD_LINK_ERROR_ALREADY_LINKED)
    ).toContain('別のユーザーに連携されています');
  });

  it('配列で渡されたときは先頭の値を使う', () => {
    expect(
      resolveDiscordLinkErrorMessage([
        DISCORD_LINK_ERROR_ALREADY_LINKED,
        'unknown',
      ])
    ).toContain('別のユーザーに連携されています');
  });

  it('未知の値や未指定は undefined (URL の文字列をそのまま表示しない)', () => {
    expect(resolveDiscordLinkErrorMessage(undefined)).toBeUndefined();
    expect(resolveDiscordLinkErrorMessage('')).toBeUndefined();
    expect(
      resolveDiscordLinkErrorMessage('<script>alert(1)</script>')
    ).toBeUndefined();
    expect(resolveDiscordLinkErrorMessage('constructor')).toBeUndefined();
    expect(resolveDiscordLinkErrorMessage('__proto__')).toBeUndefined();
    expect(resolveDiscordLinkErrorMessage([])).toBeUndefined();
  });
});
