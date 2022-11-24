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

export const WarnAlert = ({ title, description }: Props) => (
  <Alert status="warning">
    <AlertIcon />
    <AlertTitle>{title}</AlertTitle>
    {description ? <AlertDescription>{description}</AlertDescription> : <div />}
  </Alert>
);
