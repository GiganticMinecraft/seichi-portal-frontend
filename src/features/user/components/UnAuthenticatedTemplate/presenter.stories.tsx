import { ComponentMeta, ComponentStoryObj } from '@storybook/react';

import { Presenter } from './presenter';

export default {
  component: Presenter,
  title: 'features/user/components/UnAuthenticatedTemplate',
} as ComponentMeta<typeof Presenter>;

export const IsUnAuthenticated: ComponentStoryObj<typeof Presenter> = {
  args: {
    isAuthenticated: false,
    children: <p>表示されるべき要素です。</p>,
  },
};

export const IsAuthenticated: ComponentStoryObj<typeof Presenter> = {
  args: {
    isAuthenticated: true,
    children: <p>表示されるべきではない要素です。</p>,
  },
};
