import { render, screen } from '@testing-library/react';

import { Presenter } from '../presenter';

describe('ServerLogo(presenter)', () => {
  test.each`
    color
    ${'dark'}
    ${'light'}
  `('should have an image with a color', ({ color }) => {
    render(<Presenter color={color} width={100} />);
    expect(
      screen.getByAltText<HTMLImageElement>('ギガンティック☆整地鯖のロゴ').src,
    ).toBe(
      `https://github.com/GiganticMinecraft/branding/blob/master/server-logo-${color}.png?raw=true`,
    );
  });
});
