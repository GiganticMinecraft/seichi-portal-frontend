'use client';

import type { AlertColor } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';
import { useCallback, useState } from 'react';

type SnackbarState = {
  open: boolean;
  message: string;
  severity: AlertColor;
};

export const useSnackbar = () => {
  const [state, setState] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = useCallback(
    (message: string, severity: AlertColor = 'success') => {
      setState({ open: true, message, severity });
    },
    []
  );

  const closeSnackbar = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  return { snackbar: state, showSnackbar, closeSnackbar } as const;
};

const SnackbarAlert = ({
  open,
  message,
  severity,
  onClose,
}: {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
}) => (
  <Snackbar
    open={open}
    autoHideDuration={5000}
    onClose={(_, reason) => {
      if (reason !== 'clickaway') onClose();
    }}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Alert severity={severity} onClose={onClose} sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
);

export default SnackbarAlert;
