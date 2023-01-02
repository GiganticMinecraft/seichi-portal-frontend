import { ComponentMeta, ComponentStoryObj } from '@storybook/react';

import { Fallback } from './Fallback';

export default {
  component: Fallback,
  title: 'components/Fallback',
} as ComponentMeta<typeof Fallback>;

export const Index: ComponentStoryObj<typeof Fallback> = { args: {} };
