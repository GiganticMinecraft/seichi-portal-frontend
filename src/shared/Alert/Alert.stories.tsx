import { ComponentMeta, ComponentStoryObj } from '@storybook/react';

import { Alert } from './Alert';

export default {
  component: Alert,
  title: 'components/Alert',
} as ComponentMeta<typeof Alert>;

export const Index: ComponentStoryObj<typeof Alert> = {
  args: {
    title: 'Title!',
    description: 'This is description.',
  },
};

export const NoDescription: ComponentStoryObj<typeof Alert> = {
  args: {
    title: 'Title!',
  },
};
