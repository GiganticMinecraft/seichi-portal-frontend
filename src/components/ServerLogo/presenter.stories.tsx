import { ComponentMeta, ComponentStoryObj } from '@storybook/react';

import { ServerLogo } from './presenter';

export default { component: ServerLogo } as ComponentMeta<typeof ServerLogo>;

export const Dark: ComponentStoryObj<typeof ServerLogo> = {
  args: {
    width: 300,
    height: 200,
    color: 'dark',
  },
};

export const Light: ComponentStoryObj<typeof ServerLogo> = {
  args: {
    width: 300,
    height: 200,
    color: 'light',
  },
};
