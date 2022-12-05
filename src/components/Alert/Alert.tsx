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
  <ChakraAlert justifyContent="center" {...{ status }}>
    <AlertIcon />
    <Stack direction="column" align="center">
      <AlertTitle>{title}</AlertTitle>
      {description ? <AlertDescription>{description}</AlertDescription> : null}
    </Stack>
  </ChakraAlert>
);
