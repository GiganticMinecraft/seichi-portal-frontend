import { Button, ButtonProps } from '@chakra-ui/react';

export type PresenterProps = {
  onClick: () => void;
  isSigningIn: boolean;
} & ButtonProps;

export const Presenter = ({
  onClick,
  isSigningIn,
  ...props
}: PresenterProps) => (
  <Button
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    onClick={onClick}
    aria-label="サインインする"
    isLoading={isSigningIn}
    variant="solid"
    colorScheme="blue"
  >
    サインインする
  </Button>
);
