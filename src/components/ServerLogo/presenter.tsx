import Image, { type ImageProps } from 'next/image';

export type ServerLogoProps = {
  width: NonNullable<ImageProps['width']>;
  height: NonNullable<ImageProps['height']>;
  color: 'dark' | 'light';
};

export const Presenter = ({ color, width, height }: ServerLogoProps) => (
  <Image
    src={`https://github.com/GiganticMinecraft/branding/blob/master/server-logo-${color}.png?raw=true`}
    alt="ギガンティック☆整地鯖のロゴ"
    priority
    // https://ebisu.com/note/next-image-migration/
    style={{
      maxWidth: '100%',
      height: 'auto',
    }}
    {...{ width, height }}
  />
);
