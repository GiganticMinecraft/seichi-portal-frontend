import { Header } from '../Header';

type Props = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: Props) => (
  <>
    <Header />
    {children}
  </>
);
