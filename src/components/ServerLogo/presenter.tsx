import { BoxProps, Image } from '@chakra-ui/react';

type Props = {
  boxSize: NonNullable<BoxProps['boxSize']>;
  color: 'dark' | 'light';
};

export const ServerLogo = ({ color, boxSize }: Props) => (
  <Image
    src={`https://github.com/GiganticMinecraft/branding/blob/master/server-logo-${color}.png?raw=true`}
    alt="ギガンティック☆整地鯖のロゴ"
    {...{ boxSize }}
  />
);
