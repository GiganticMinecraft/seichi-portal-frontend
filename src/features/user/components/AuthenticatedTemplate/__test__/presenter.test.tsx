import { composeStories } from '@storybook/testing-react';
import { render } from '@testing-library/react';

import * as stories from '../presenter.stories';

describe('AuthenticatedTemplate', () => {
  const { IsAuthenticated, IsUnauthenticated } = composeStories(stories);

  test('should render the children elements when authenticated', async () => {
    const { container } = render(<IsAuthenticated />);
    await IsAuthenticated.play({ canvasElement: container });
  });

  test('should not render the children elements when unauthenticated', async () => {
    const { container } = render(<IsUnauthenticated />);
    await IsUnauthenticated.play({ canvasElement: container });
  });
});
