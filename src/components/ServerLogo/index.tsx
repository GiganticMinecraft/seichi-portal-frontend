import Image, { type ImageProps } from 'next/image';

type Props = {
  width: NonNullable<ImageProps['width']>;
  height: NonNullable<ImageProps['height']>;
  color: 'dark' | 'light';
};

export const ServerLogo = ({ color, width, height }: Props) => (
  <Image
    src={`https://github.com/GiganticMinecraft/branding/blob/master/server-logo-${color}.png?raw=true`}
    alt="ギガンティック☆整地鯖のロゴ"
    {...{ width, height }}
  />
);
