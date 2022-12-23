import { ComponentMeta, ComponentStoryObj } from '@storybook/react';

import { Presenter } from './presenter';

export default {
  component: Presenter,
  title: 'features/forms/components/FormInfoList',
} as ComponentMeta<typeof Presenter>;

export const Index: ComponentStoryObj<typeof Presenter> = {
  args: {
    forms: [
      {
        id: 0,
        form_name: '通報',
        description: '通報フォームです。',
      },
    ],
  },
};

export const NoFormInfo: ComponentStoryObj<typeof Presenter> = {
  args: {
    forms: [],
  },
};
