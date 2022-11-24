import { Box, Heading, Stack, StackDivider, Text } from '@chakra-ui/react';

import { WarnAlert } from '@/components/Alert';

import type { FormId, FormInfo } from '../../types';

type Props = {
  forms?: FormInfo[];
  onClick?: (id: FormId) => void;
};

export const Presenter = ({ forms = [], onClick = () => undefined }: Props) => (
  <Stack spacing={4} divider={<StackDivider />}>
    {forms.length === 0 ? (
      <WarnAlert title="現在回答可能なフォームはありません。" />
    ) : (
      forms.map((form) => (
        <Box key={form.id} onClick={() => onClick(form.id)}>
          <Heading fontSize="lg" mb={2}>
            {form.title}
          </Heading>
          <Text fontSize="md">{form.description}</Text>
        </Box>
      ))
    )}
  </Stack>
);
