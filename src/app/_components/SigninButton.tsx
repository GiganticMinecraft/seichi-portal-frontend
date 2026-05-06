'use client';

import { Button } from '@mui/material';
import NextLink from 'next/link';

export const SigninButton = () => {
  return (
    <Button component={NextLink} color="inherit" href="/login">
      サインイン
    </Button>
  );
};
