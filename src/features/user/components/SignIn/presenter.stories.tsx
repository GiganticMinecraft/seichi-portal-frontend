import { ComponentMeta, ComponentStoryObj } from '@storybook/react';

import { Presenter } from './presenter';

export default {
  component: Presenter,
  title: 'features/user/components/SignIn',
} as ComponentMeta<typeof Presenter>;

export const Index: ComponentStoryObj<typeof Presenter> = {
  args: {
    onClick: () => undefined,
    isSigningIn: false,
  },
};

export const IsSigningIn: ComponentStoryObj<typeof Presenter> = {
  args: {
    onClick: () => undefined,
    isSigningIn: true,
  },
};
