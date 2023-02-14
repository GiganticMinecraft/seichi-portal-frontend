import { ComponentMeta, ComponentStoryObj } from '@storybook/react';

import { Presenter } from './presenter';

export default {
  component: Presenter,
  title: 'components/ToggleColorMode',
} as ComponentMeta<typeof Presenter>;

export const Dark: ComponentStoryObj<typeof Presenter> = {
  args: {
    currentColorMode: 'dark',
  },
};

export const Light: ComponentStoryObj<typeof Presenter> = {
  args: {
    currentColorMode: 'light',
  },
};
