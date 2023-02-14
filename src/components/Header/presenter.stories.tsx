import { ComponentMeta, ComponentStoryObj } from '@storybook/react';

import { Presenter } from './presenter';

export default {
  component: Presenter,
  title: 'components/Header',
} as ComponentMeta<typeof Presenter>;

export const IsAuthenticated: ComponentStoryObj<typeof Presenter> = {
  args: { isAuthenticated: true },
};

export const IsNotAuthenticated: ComponentStoryObj<typeof Presenter> = {
  args: { isAuthenticated: false },
};
