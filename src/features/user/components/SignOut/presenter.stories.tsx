import { expect, jest } from '@storybook/jest';
import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';

import { Presenter } from './presenter';

export default {
  component: Presenter,
  title: 'features/user/components/SignOut',
} as ComponentMeta<typeof Presenter>;

export const Index: ComponentStoryObj<typeof Presenter> = {
  args: {
    onClick: jest.fn(),
    isSigningOut: false,
  },
  play: async ({ canvasElement, args: { onClick } }) => {
    const { getByLabelText } = within(canvasElement);
    userEvent.click(getByLabelText('サインアウトする'));
    expect(onClick).toBeCalled();
  },
};

export const IsSigningOut: ComponentStoryObj<typeof Presenter> = {
  args: {
    onClick: () => undefined,
    isSigningOut: true,
  },
  play: async ({ canvasElement, args: { onClick } }) => {
    const { getByLabelText } = within(canvasElement);
    userEvent.click(getByLabelText('サインアウトする'));
    expect(onClick).not.toBeCalled();
  },
};
