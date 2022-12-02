import { ComponentMeta, ComponentStoryObj } from '@storybook/react';

import { formInfoList } from '@/__mocks__/data';

import { Presenter } from './presenter';

export default {
  component: Presenter,
  title: 'features/forms/components/FormInfoList',
} as ComponentMeta<typeof Presenter>;

export const Index: ComponentStoryObj<typeof Presenter> = {
  args: {
    forms: formInfoList,
  },
};

export const NoFormInfo: ComponentStoryObj<typeof Presenter> = {
  args: {
    forms: [],
  },
};
