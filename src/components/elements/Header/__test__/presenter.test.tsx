import { render, screen } from '@testing-library/react';

import { Presenter } from '../presenter';

describe('Header', () => {
  it('should contain SignOut button', () => {
    render(<Presenter isAuthenticated />);
    expect(screen.getByLabelText('サインアウトする')).toBeDefined();
    expect(screen.queryByLabelText('サインインする')).toBeNull();
  });

  it('should contain SignIn button', () => {
    render(<Presenter isAuthenticated={false} />);
    expect(screen.getByLabelText('サインインする')).toBeDefined();
    expect(screen.queryByLabelText('サインアウトする')).toBeNull();
  });
});
