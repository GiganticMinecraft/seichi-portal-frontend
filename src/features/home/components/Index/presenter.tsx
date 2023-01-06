import { SimpleGrid, Text } from '@chakra-ui/react';

import { LikeLink } from '@/shared/LikeLink';

export const HomeIndex = () => (
  <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={5}>
    <LikeLink title="新規に回答をする" path="/forms">
      <Text>回答可能なフォームに回答することができます。</Text>
    </LikeLink>
    <LikeLink title="過去の回答内容を確認する" path="/forms">
      <Text>過去にフォームに回答した内容を確認することができます。</Text>
    </LikeLink>
  </SimpleGrid>
);
