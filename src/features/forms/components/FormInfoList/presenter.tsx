import { SimpleGrid, Text } from '@chakra-ui/react';

import { Alert } from '@/components/Alert';
import { LikeLink } from '@/components/LikeLink';

import type { FormInfo } from '../../types/formInfo';

type Props = {
  forms?: FormInfo[];
};

export const Presenter = ({ forms = [] }: Props) =>
  forms.length === 0 ? (
    <Alert status="warning" title="現在回答可能なフォームはありません。" />
  ) : (
    <SimpleGrid columns={{ base: 1, sm: 4 }} spacing={5}>
      {forms.map((form) => (
        <LikeLink
          key={form.id}
          title={form.form_name}
          path={{ pathname: '/forms/[id]', query: { id: form.id.toString() } }}
        >
          <Text fontSize="md" noOfLines={3}>
            {form.description}
          </Text>
        </LikeLink>
      ))}
    </SimpleGrid>
  );
