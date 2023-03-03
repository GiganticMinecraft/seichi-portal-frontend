import { Button, ButtonProps } from '@chakra-ui/react';

export type PresenterProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isSigningIn: boolean;
} & ButtonProps;

export const Presenter = ({
  onClick,
  isSigningIn: isLoading,
  ...props
}: PresenterProps) => (
  <Button
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    {...{ onClick, isLoading }}
    aria-label="サインインする"
    variant="solid"
    colorScheme="blue"
  >
    サインインする
  </Button>
);
