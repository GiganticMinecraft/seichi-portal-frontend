export type PresenterProps = {
  isAuthenticated: boolean;
  children: React.ReactNode;
};

export const Presenter = ({ isAuthenticated, children }: PresenterProps) =>
  // eslint-disable-next-line react/jsx-no-useless-fragment
  isAuthenticated ? null : <>{children}</>;
