import Image from 'next/image';

import type { ImageProps } from 'next/image';

type Props = {
  width: ImageProps['width'];
  height: ImageProps['height'];
  color: 'dark' | 'light';
};

export const ServerLogo = ({ color, width, height }: Props) => (
  <Image
    src={`https://github.com/GiganticMinecraft/branding/blob/master/server-logo-${color}.png?raw=true`}
    alt="ギガンティック☆整地鯖のロゴ"
    {...{ width, height }}
  />
);
