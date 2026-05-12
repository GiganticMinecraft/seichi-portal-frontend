import { expect, test } from '@playwright/test';

test('redirects unauthenticated /forms access to login', async ({
  request,
}) => {
  const response = await request.get('/forms', {
    maxRedirects: 0,
  });

  expect(response.status()).toBeGreaterThanOrEqual(300);
  expect(response.status()).toBeLessThan(400);
  expect(response.headers()['location']).toContain('/login');
  expect(response.headers()['set-cookie']).toContain(
    'SEICHI_PORTAL__POST_LOGIN_REDIRECT=%2Fforms'
  );
});

test('redirects unauthenticated /admin access to login', async ({
  request,
}) => {
  const response = await request.get('/admin', {
    maxRedirects: 0,
  });

  expect(response.status()).toBeGreaterThanOrEqual(300);
  expect(response.status()).toBeLessThan(400);
  expect(response.headers()['location']).toContain('/login');
  expect(response.headers()['set-cookie']).toContain(
    'SEICHI_PORTAL__POST_LOGIN_REDIRECT=%2Fadmin'
  );
});
