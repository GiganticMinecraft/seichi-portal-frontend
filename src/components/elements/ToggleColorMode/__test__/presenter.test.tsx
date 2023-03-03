import { render, screen } from '@testing-library/react';

import { Presenter } from '../presenter';

describe('ToggleColorMode', () => {
  test.each`
    currentColorMode | expectedIcon | unexpectedIcon
    ${'light'}       | ${'moon'}    | ${'sun'}
    ${'dark'}        | ${'sun'}     | ${'moon'}
  `(
    'should have a proper icon',
    ({ currentColorMode, expectedIcon, unexpectedIcon }) => {
      render(
        <Presenter
          currentColorMode={currentColorMode}
          toggleColorMode={() => undefined}
        />,
      );
      expect(screen.getByTestId(`toggle-icon-${expectedIcon}`)).toBeDefined();
      expect(screen.queryByTestId(`toggle-icon-${unexpectedIcon}`)).toBeNull();
    },
  );
});
