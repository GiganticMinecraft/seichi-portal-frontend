import { alpha } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

export const adminFormFieldSx: SxProps<Theme> = {
  '& .MuiFormControl-root .MuiInputLabel-formControl': {
    position: 'static',
    transform: 'none',
    transition: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    color: 'text.primary',
    mb: 0.5,
  },
  '& .MuiFormControl-root .MuiOutlinedInput-input': {
    paddingTop: '10px',
    paddingBottom: '8px',
    height: 'auto',
    backgroundColor: (theme) =>
      theme.palette.mode === 'dark'
        ? undefined
        : alpha(theme.palette.common.white, 0.92),
  },
  '& .MuiFormControl-root .MuiOutlinedInput-notchedOutline': {
    top: 0,
    borderColor: (theme) =>
      theme.palette.mode === 'dark'
        ? undefined
        : alpha(theme.palette.text.primary, 0.2),
  },
  '& .MuiFormControl-root .MuiOutlinedInput-notchedOutline legend': {
    display: 'none',
  },
  '& .MuiFormHelperText-root': {
    ml: 0,
  },
};
