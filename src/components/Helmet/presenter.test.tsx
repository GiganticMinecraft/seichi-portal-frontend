import { render } from '@testing-library/react';

import { Helmet } from './presenter';

jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: { children: Array<React.ReactElement> }) => (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{children}</>
  ),
}));

describe('Helmet', () => {
  const siteName = 'SeichiPortal';
  const titleSuffix = ` | ${siteName}`;

  test.each`
    received      | expected
    ${'Hello'}    | ${`Hello${titleSuffix}`}
    ${'Top Page'} | ${`Top Page${titleSuffix}`}
    ${''}         | ${siteName}
    ${undefined}  | ${siteName}
  `(
    'should set page title to "$expected" when "$received" is given',
    ({ received, expected }) => {
      render(<Helmet title={received} />, {
        container: document.head,
      });

      expect(document.title).toEqual(expected);
    },
  );
  test.each`
    received              | expected
    ${'This is my site!'} | ${'This is my site!'}
    ${'Hello World.'}     | ${'Hello World.'}
    ${''}                 | ${''}
    ${undefined}          | ${''}
  `(
    `should set description to ""$expected when "$received" is given`,
    ({ received, expected }) => {
      const { getByTestId } = render(<Helmet description={received} />, {
        container: document.head,
      });

      const metaDescription = getByTestId('meta-desc');

      expect(metaDescription.getAttribute('content')).toEqual(expected);
    },
  );
});
