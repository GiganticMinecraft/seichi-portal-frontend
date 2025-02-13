'use client';

import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import {
  ErrorResponse,
  GetUsersResponse,
} from '@/app/api/_schemas/ResponseSchemas';
import { Box, Stack } from '@mui/material';
import { Either } from 'fp-ts/lib/Either';
import useSWR from 'swr';
import UserInformation from './_components/UserInformation';
import UnlinkDiscordButton from './_components/UnlinkDiscordButton';
import LinkDiscordButton from './_components/LinkDiscordButton';

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
