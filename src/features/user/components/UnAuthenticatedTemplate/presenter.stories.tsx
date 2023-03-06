import { expect } from '@storybook/jest';
import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { within } from '@storybook/testing-library';

import { Presenter } from './presenter';

export default {
  component: Presenter,
  title: 'features/user/components/UnauthenticatedTemplate',
} as ComponentMeta<typeof Presenter>;

export const IsUnauthenticated: ComponentStoryObj<typeof Presenter> = {
  args: {
    isAuthenticated: false,
    children: <p data-testid="target-text">表示されるべき要素です。</p>,
  },
  play: async ({ canvasElement }) => {
    const { getByTestId } = within(canvasElement);
    expect(getByTestId('target-text')).toBeInTheDocument();
  },
};

export const IsAuthenticated: ComponentStoryObj<typeof Presenter> = {
  args: {
    isAuthenticated: true,
    children: <p data-testid="target-text">表示されるべきではない要素です。</p>,
  },
  play: async ({ canvasElement }) => {
    const { queryByTestId } = within(canvasElement);
    expect(queryByTestId('target-text')).toBeFalsy();
  },
};
