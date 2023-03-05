import { composeStories } from '@storybook/testing-react';
import { render } from '@testing-library/react';

import * as stories from '../presenter.stories';

describe('UnauthenticatedTemplate', () => {
  const { IsAuthenticated, IsUnAuthenticated } = composeStories(stories);

  test('should not render the children elements when authenticated', async () => {
    const { container } = render(<IsAuthenticated />);
    await IsAuthenticated.play({ canvasElement: container });
  });

  test('should render the children elements when unauthenticated', async () => {
    const { container } = render(<IsUnAuthenticated />);
    await IsUnAuthenticated.play({ canvasElement: container });
  });
});
