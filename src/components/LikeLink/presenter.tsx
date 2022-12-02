import { Flex, Icon, Box, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { IconType } from 'react-icons';

type Props = {
  icon?: IconType;
  title: string;
  children: React.ReactNode;
  path: string;
};

export const LikeLink = ({ icon, title, children, path }: Props) => (
  <Box
    borderWidth={2}
    _hover={{ bgColor: 'cyan.100' }}
    _active={{ bgColor: 'cyan.400' }}
  >
    <Link href={path}>
      <Flex
        px={2}
        py={30}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        {icon ? <Icon as={icon} boxSize="3rem" mb={3} /> : null}
        <Text as="b" fontSize="lg" mb={3}>
          {title}
        </Text>
        {children}
      </Flex>
    </Link>
  </Box>
);
