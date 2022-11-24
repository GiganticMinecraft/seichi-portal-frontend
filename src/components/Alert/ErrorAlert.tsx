import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

type Props = {
  title: string;
  description?: string;
};

export const ErrorAlert = ({ title, description }: Props) => (
  <Alert status="error">
    <AlertIcon />
    <AlertTitle>{title}</AlertTitle>
    {description ? <AlertDescription>{description}</AlertDescription> : <div />}
  </Alert>
);
