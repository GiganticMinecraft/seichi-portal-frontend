import { composeStories } from '@storybook/testing-react';
import { render } from '@testing-library/react';

import * as stories from '../presenter.stories';

describe('SignOut', () => {
  const { Index, IsSigningOut } = composeStories(stories);

  test("should call onClick when it's clicked", async () => {
    const { container } = render(<Index />);
    await Index.play({ canvasElement: container });
  });

  test("should not call onClick when it's clicked while signing out", async () => {
    const { container } = render(<IsSigningOut />);
    await IsSigningOut.play({ canvasElement: container });
  });
});
