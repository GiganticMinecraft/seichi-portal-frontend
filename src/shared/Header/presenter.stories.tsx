import { ComponentMeta, ComponentStoryObj } from '@storybook/react';

import { Header } from './presenter';

export default {
  component: Header,
  title: 'components/Header',
} as ComponentMeta<typeof Header>;

export const Index: ComponentStoryObj<typeof Header> = { args: {} };
