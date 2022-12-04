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
  <ChakraAlert justifyContent={['center', 'start']} {...{ status }}>
    <Stack direction={['column', 'row']} align={['center', 'start']}>
      <AlertIcon />
      <AlertTitle>{title}</AlertTitle>
      {description ? <AlertDescription>{description}</AlertDescription> : null}
    </Stack>
  </ChakraAlert>
);
