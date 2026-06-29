import '@testing-library/jest-dom/vitest';

import { createElement } from 'react';
import type { AnchorHTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';
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

type NextImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  blurDataURL?: string;
  fill?: boolean;
  loader?: unknown;
  placeholder?: string;
  priority?: boolean;
  quality?: number | `${number}`;
  unoptimized?: boolean;
};

type NextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children?: ReactNode;
  legacyBehavior?: boolean;
  locale?: string | false;
  passHref?: boolean;
  prefetch?: boolean | null;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
};

vi.mock('next/image', () => ({
  default: ({
    blurDataURL,
    fill,
    loader,
    placeholder,
    priority,
    quality,
    unoptimized,
    ...props
  }: NextImageProps) => {
    void [
      blurDataURL,
      fill,
      loader,
      placeholder,
      priority,
      quality,
      unoptimized,
    ];

    return createElement('img', props);
  },
}));

vi.mock('next/link', () => ({
  default: ({
    legacyBehavior,
    locale,
    passHref,
    prefetch,
    replace,
    scroll,
    shallow,
    ...props
  }: NextLinkProps) => {
    void [legacyBehavior, locale, passHref, prefetch, replace, scroll, shallow];

    return createElement('a', props);
  },
}));
