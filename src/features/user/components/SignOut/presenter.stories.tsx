import { ComponentMeta, ComponentStoryObj } from '@storybook/react';

import { Presenter } from './presenter';

export default {
  component: Presenter,
  title: 'features/user/components/SignOut',
} as ComponentMeta<typeof Presenter>;

export const Index: ComponentStoryObj<typeof Presenter> = {
  args: {
    onClick: () => undefined,
    isSigningOut: false,
  },
};

export const IsSigningOut: ComponentStoryObj<typeof Presenter> = {
  args: {
    onClick: () => undefined,
    isSigningOut: true,
  },
};
