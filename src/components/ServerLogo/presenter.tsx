import { Image, type ImageProps } from '@chakra-ui/react';

export type PresenterProps = {
  width: NonNullable<ImageProps['width']>;
  color: 'dark' | 'light';
} & Omit<ImageProps, 'color'>;

export const Presenter = ({ color, width, ...props }: PresenterProps) => (
  <Image
    src={`https://github.com/GiganticMinecraft/branding/blob/master/server-logo-${color}.png?raw=true`}
    alt="ギガンティック☆整地鯖のロゴ"
    // https://ebisu.com/note/next-image-migration/
    maxW="100%"
    height="auto"
    {...{ width }}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
);
