import { Button, ButtonProps } from '@chakra-ui/react';

export type PresenterProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isSigningOut: boolean;
} & ButtonProps;

export const Presenter = ({
  onClick,
  isSigningOut: isLoading,
  ...props
}: PresenterProps) => (
  <Button
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    {...{ onClick, isLoading }}
    aria-label="サインアウトする"
  >
    サインアウトする
  </Button>
);
