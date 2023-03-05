import { composeStories } from '@storybook/testing-react';
import { render } from '@testing-library/react';

import * as stories from '../presenter.stories';

describe('SignIn', () => {
  const { Index, IsSigningIn } = composeStories(stories);

  test("should call onClick when it's clicked", async () => {
    const { container } = render(<Index />);
    await Index.play({ canvasElement: container });
  });

  test("should not call onClick when it's clicked while signing in", async () => {
    const { container } = render(<IsSigningIn />);
    await IsSigningIn.play({ canvasElement: container });
  });
});
