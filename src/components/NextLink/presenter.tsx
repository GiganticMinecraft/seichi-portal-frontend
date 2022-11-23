import Link from 'next/link';

type Props = {
  children: React.ReactNode;
  href: string;
};

export const NextLink = ({ children, href }: Props) => (
  <Link href={href} passHref>
    {children}
  </Link>
);
