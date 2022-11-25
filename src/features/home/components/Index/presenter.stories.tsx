import { ComponentMeta, ComponentStoryObj } from '@storybook/react';

import { HomeIndex } from './presenter';

export default {
  component: HomeIndex,
  title: 'features/home/components/index/HomeIndex',
} as ComponentMeta<typeof HomeIndex>;

export const Index: ComponentStoryObj<typeof HomeIndex> = { args: {} };
