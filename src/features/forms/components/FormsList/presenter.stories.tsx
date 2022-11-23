import { ComponentMeta, ComponentStoryObj } from '@storybook/react';

import { asNonEmptyString } from '@/types';

import { Presenter } from './presenter';

import { asFormId, FormInfo } from '../../types';

export default {
  component: Presenter,
  title: 'features/forms/components/FormsList',
} as ComponentMeta<typeof Presenter>;

const forms: FormInfo[] = [
  {
    id: asFormId(1),
    title: asNonEmptyString('通報'),
    description: '通報フォームです。',
  },
  {
    id: asFormId(2),
    title: asNonEmptyString('不具合報告'),
    description: '不具合報告フォームです。',
  },
];

export const Index: ComponentStoryObj<typeof Presenter> = {
  args: {
    forms,
  },
};

export const NoForms: ComponentStoryObj<typeof Presenter> = {
  args: {
    forms: [],
  },
};
