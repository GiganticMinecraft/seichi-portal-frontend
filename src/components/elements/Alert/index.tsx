import {
  Alert as ChakraAlert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  AlertProps,
  Stack,
} from '@chakra-ui/react';

type Props = {
  title: string;
  description?: string;
  status: NonNullable<AlertProps['status']>;
};

export const Alert = ({ title, description, status }: Props) => (
  <ChakraAlert
    justifyContent="center"
    flexDirection={['column', 'row']}
    {...{ status }}
  >
    <AlertIcon mb={2} mr={[0, 3]} />
    <Stack direction="column" align="center">
      <AlertTitle mr={0}>{title}</AlertTitle>
      {description ? <AlertDescription>{description}</AlertDescription> : null}
    </Stack>
  </ChakraAlert>
);
