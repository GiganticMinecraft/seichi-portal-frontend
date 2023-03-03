import { expect, jest } from '@storybook/jest';
import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';

import { Presenter } from './presenter';

export default {
  component: Presenter,
  title: 'features/user/components/SignIn',
} as ComponentMeta<typeof Presenter>;

export const Index: ComponentStoryObj<typeof Presenter> = {
  args: {
    onClick: jest.fn(),
    isSigningIn: false,
  },
  play: async ({ canvasElement, args: { onClick } }) => {
    const { getByLabelText } = within(canvasElement);
    userEvent.click(getByLabelText('サインインする'));
    expect(onClick).toBeCalled();
  },
};

export const IsSigningIn: ComponentStoryObj<typeof Presenter> = {
  args: {
    onClick: jest.fn(),
    isSigningIn: true,
  },
  play: async ({ canvasElement, args: { onClick } }) => {
    const { getByLabelText } = within(canvasElement);
    userEvent.click(getByLabelText('サインインする'));
    expect(onClick).not.toBeCalled();
  },
};
