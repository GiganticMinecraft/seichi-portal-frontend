'use client';

import { Box, Stack } from '@mui/material';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import LinkDiscordButton from './_components/LinkDiscordButton';
import UnlinkDiscordButton from './_components/UnlinkDiscordButton';
import UserInformation from './_components/UserInformation';
import type {
  ErrorResponse,
  GetUsersResponse,
} from '@/app/api/_schemas/ResponseSchemas';
import type { Either } from 'fp-ts/lib/Either';

const Home = ({ params }: { params: { userId: string } }) => {
  const { data, isLoading } = useSWR<Either<ErrorResponse, GetUsersResponse>>(
    `/api/proxy/users/${params.userId}`
  );

  if (!data) {
    return <LoadingCircular />;
  } else if ((!isLoading && !data) || data._tag == 'Left') {
    return <ErrorModal />;
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
      }}
    >
      <Stack spacing={2}>
        <UserInformation user={data.right} />
        {data.right.discord_user_id ? (
          <UnlinkDiscordButton />
        ) : (
          <LinkDiscordButton />
        )}
      </Stack>
    </Box>
  );
};

export default Home;
