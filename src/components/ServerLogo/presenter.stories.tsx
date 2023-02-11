import { ComponentMeta, ComponentStoryObj } from '@storybook/react';

import { Presenter } from './presenter';

export default {
  component: Presenter,
  title: 'components/ServerLogo',
} as ComponentMeta<typeof Presenter>;

export const Dark: ComponentStoryObj<typeof Presenter> = {
  args: {
    width: 300,
    height: 200,
    color: 'dark',
  },
};

export const Light: ComponentStoryObj<typeof Presenter> = {
  args: {
    width: 300,
    height: 200,
    color: 'light',
  },
};
