import { Box, Heading, Stack, StackDivider, Text } from '@chakra-ui/react';

import type { FormInfo } from '../../types';

type Props = {
  forms: FormInfo[];
};

export const Presenter = ({ forms }: Props) => (
  <Stack spacing={4} divider={<StackDivider />}>
    {forms.map((form) => (
      <Box>
        <Heading fontSize="lg" mb={2}>
          {form.title}
        </Heading>
        <Text fontSize="md">{form.description}</Text>
      </Box>
    ))}
  </Stack>
);
