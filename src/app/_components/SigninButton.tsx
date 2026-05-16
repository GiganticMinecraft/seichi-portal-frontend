'use client';

import { Alert, Button, Snackbar } from '@mui/material';
import { useRedirectLogin } from './useRedirectLogin';

export const SigninButton = () => {
  const { errorMessage, handleLogin, resetError } = useRedirectLogin();

  return (
    <>
      <Button color="inherit" onClick={handleLogin}>
        サインイン
      </Button>
      <Snackbar
        open={errorMessage !== null}
        autoHideDuration={6000}
        onClose={resetError}
      >
        <Alert onClose={resetError} severity="error" variant="filled">
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
