import {
  Alert as ChakraAlert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  AlertProps,
} from '@chakra-ui/react';

type Props = {
  title: string;
  description?: string;
  status: NonNullable<AlertProps['status']>;
};

export const Alert = ({ title, description, status }: Props) => (
  <ChakraAlert {...{ status }}>
    <AlertIcon />
    <AlertTitle>{title}</AlertTitle>
    {description ? <AlertDescription>{description}</AlertDescription> : <div />}
  </ChakraAlert>
);
