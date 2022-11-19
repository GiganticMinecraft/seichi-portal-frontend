import { Box, Button } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

export const Header = () => (
  <Box bg="cyan.300" py="3" textAlign="center">
    <Button variant="link">
      <Link href="/">
        <Image
          src="https://github.com/GiganticMinecraft/branding/blob/master/server-logo-black.png?raw=true"
          alt="ギガンティック☆整地鯖のロゴ"
          width={110}
          height={100}
        />
      </Link>
    </Button>
  </Box>
);
