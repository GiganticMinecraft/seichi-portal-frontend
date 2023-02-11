import { render, screen } from '@testing-library/react';

import { Presenter } from '../presenter';

// https://zenn.dev/link/comments/ce714aee7a1418
jest.mock(
  'next/image',
  () =>
    // priorityプロパティを使用しているが、これはNext/Image固有のものなので、imgには渡せない
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, func-names
    function ({ src, alt, priority, ...props }: any) {
      // eslint-disable-next-line @next/next/no-img-element, react/jsx-props-no-spreading
      return <img src={src} alt={alt} {...props} />;
    },
);

describe('ServerLogo(presenter)', () => {
  test.each`
    color
    ${'dark'}
    ${'light'}
  `('should have an image with a color', ({ color }) => {
    render(<Presenter color={color} width={100} height={100} />);
    expect(
      screen.getByAltText<HTMLImageElement>('ギガンティック☆整地鯖のロゴ').src,
    ).toBe(
      `https://github.com/GiganticMinecraft/branding/blob/master/server-logo-${color}.png?raw=true`,
    );
  });
});
