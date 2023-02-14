import { Button, ButtonProps } from '@chakra-ui/react';

export type PresenterProps = {
  onClick: () => void;
  isSigningOut: boolean;
} & Omit<ButtonProps, 'onClick' | 'aria-label' | 'isLoading'>;

export const Presenter = ({
  onClick,
  isSigningOut,
  ...props
}: PresenterProps) => (
  <Button
    onClick={onClick}
    aria-label="サインアウトする"
    isLoading={isSigningOut}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    サインアウトする
  </Button>
);
