import { ComponentMeta, ComponentStoryObj } from '@storybook/react';

import { ServerLogo } from './presenter';

export default {
  component: ServerLogo,
  title: 'components/ServerLogo',
} as ComponentMeta<typeof ServerLogo>;

export const Dark: ComponentStoryObj<typeof ServerLogo> = {
  args: {
    boxSize: 'md',
    color: 'dark',
  },
};

export const Light: ComponentStoryObj<typeof ServerLogo> = {
  args: {
    boxSize: 'md',
    color: 'light',
  },
};
