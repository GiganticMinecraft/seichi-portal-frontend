import { Text } from '@chakra-ui/react';
import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import { FaListAlt } from 'react-icons/fa';

import { LikeLink } from './presenter';

export default {
  component: LikeLink,
  title: 'components/LikeLink',
} as ComponentMeta<typeof LikeLink>;

export const Index: ComponentStoryObj<typeof LikeLink> = {
  args: {
    title: 'タイトル',
    children: <Text>ここには説明が入ります。</Text>,
    path: { pathname: '/' },
  },
};

export const WithIcon: ComponentStoryObj<typeof LikeLink> = {
  args: {
    title: 'タイトル',
    icon: FaListAlt,
    children: <Text>ここには説明が入ります。</Text>,
    path: { pathname: '/' },
  },
};
