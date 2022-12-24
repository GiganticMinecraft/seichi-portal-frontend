import { SimpleGrid, UnorderedList, ListItem } from '@chakra-ui/react';
import { FaListAlt } from 'react-icons/fa';

import { LikeLink } from '@/components/LikeLink';

export const HomeIndex = () => (
  <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={5}>
    <LikeLink icon={FaListAlt} title="フォームに回答する" path="/forms">
      <UnorderedList>
        <ListItem>回答可能なフォームに回答する</ListItem>
        <ListItem>回答した内容を確認する</ListItem>
      </UnorderedList>
    </LikeLink>
  </SimpleGrid>
);
