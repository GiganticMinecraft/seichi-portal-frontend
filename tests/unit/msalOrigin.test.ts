import { afterEach, describe, expect, it } from 'vitest';

import { getMsalConfig, getMsalOrigin } from '@/env.server';

const originalRedirectUrl = process.env['MS_APP_REDIRECT_URL'];
const originalClientId = process.env['MS_APP_CLIENT_ID'];

afterEach(() => {
  if (originalRedirectUrl === undefined) {
    delete process.env['MS_APP_REDIRECT_URL'];
  } else {
    process.env['MS_APP_REDIRECT_URL'] = originalRedirectUrl;
  }

  if (originalClientId === undefined) {
    delete process.env['MS_APP_CLIENT_ID'];
  } else {
    process.env['MS_APP_CLIENT_ID'] = originalClientId;
  }
});

describe('getMsalOrigin', () => {
  it.each([
    ['http://localhost:3000', 'http://localhost:3000'],
    ['https://portal.seichi.click/', 'https://portal.seichi.click'],
  ])('redirect URI %s から %s だけを返す', (redirectUrl, expectedOrigin) => {
    process.env['MS_APP_REDIRECT_URL'] = redirectUrl;

    expect(getMsalOrigin()).toBe(expectedOrigin);
  });

  it.each([
    ['未設定', undefined],
    ['URL でない値', 'not-a-url'],
    ['http/https 以外の URL', 'ftp://portal.seichi.click/callback'],
  ])('%s の場合は Zod parse に失敗する', (_case, value) => {
    if (value === undefined) {
      delete process.env['MS_APP_REDIRECT_URL'];
    } else {
      process.env['MS_APP_REDIRECT_URL'] = value;
    }

    expect(() => getMsalOrigin()).toThrow();
  });
});

describe('getMsalConfig', () => {
  it('MSAL 用には redirect URI の raw value を返す', () => {
    process.env['MS_APP_CLIENT_ID'] = 'client-id';
    process.env['MS_APP_REDIRECT_URL'] =
      'https://portal.seichi.click/signin-oidc/';

    expect(getMsalConfig()).toEqual({
      clientId: 'client-id',
      redirectUri: 'https://portal.seichi.click/signin-oidc/',
    });
  });
});
