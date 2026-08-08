import { afterEach, describe, expect, it } from 'vitest';

import { getSeichiProxyHeaders } from '@/env.server';

const originalSecret = process.env['SEICHI_PROXY_SECRET'];
const originalIpHeader = process.env['SEICHI_CLIENT_IP_HEADER'];

afterEach(() => {
  if (originalSecret === undefined) {
    delete process.env['SEICHI_PROXY_SECRET'];
  } else {
    process.env['SEICHI_PROXY_SECRET'] = originalSecret;
  }
  if (originalIpHeader === undefined) {
    delete process.env['SEICHI_CLIENT_IP_HEADER'];
  } else {
    process.env['SEICHI_CLIENT_IP_HEADER'] = originalIpHeader;
  }
});

describe('server-side proxy metadata', () => {
  it('maps only a configured canonical ingress IP and ignores browser custom headers', () => {
    process.env['SEICHI_PROXY_SECRET'] = 'server-secret';
    process.env['SEICHI_CLIENT_IP_HEADER'] = 'X-Real-IP';

    expect(
      getSeichiProxyHeaders(
        new Headers({
          'X-Real-IP': '203.0.113.10',
          'x-seichi-proxy-secret': 'browser-secret',
          'x-seichi-client-ip': '198.51.100.5',
        })
      )
    ).toEqual({
      'x-seichi-proxy-secret': 'server-secret',
      'x-seichi-client-ip': '203.0.113.10',
    });
  });

  it('omits metadata when secret or ingress IP is missing or invalid', () => {
    process.env['SEICHI_PROXY_SECRET'] = '   ';
    process.env['SEICHI_CLIENT_IP_HEADER'] = 'X-Real-IP';
    expect(
      getSeichiProxyHeaders(new Headers({ 'X-Real-IP': '203.0.113.10' }))
    ).toEqual({});

    process.env['SEICHI_PROXY_SECRET'] = 'server-secret';
    expect(
      getSeichiProxyHeaders(new Headers({ 'X-Real-IP': 'not-an-ip' }))
    ).toEqual({ 'x-seichi-proxy-secret': 'server-secret' });

    process.env['SEICHI_CLIENT_IP_HEADER'] = 'X-User-Id';
    expect(
      getSeichiProxyHeaders(new Headers({ 'X-User-Id': '203.0.113.10' }))
    ).toEqual({ 'x-seichi-proxy-secret': 'server-secret' });
  });
});
