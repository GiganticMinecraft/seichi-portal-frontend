import '@testing-library/jest-dom/vitest';

import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  usePathname: () => '/',
  useRouter: () => ({
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    push: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/image', () => ({
  default: 'img',
}));

vi.mock('next/link', () => ({
  default: 'a',
}));
