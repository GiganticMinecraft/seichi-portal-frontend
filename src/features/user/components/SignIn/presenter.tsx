import { Button, ButtonProps } from '@chakra-ui/react';

export type PresenterProps = {
  onClick: () => void;
  isSigningIn: boolean;
} & Omit<ButtonProps, 'onClick' | 'aria-label' | 'isLoading'>;

export const Presenter = ({
  onClick,
  isSigningIn,
  ...props
}: PresenterProps) => (
  <Button
    onClick={onClick}
    aria-label="サインインする"
    isLoading={isSigningIn}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    サインインする
  </Button>
);
