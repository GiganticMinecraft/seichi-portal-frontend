import { alpha } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

export const adminFormFieldSx: SxProps<Theme> = {
  '& .MuiFormControl-root .MuiOutlinedInput-input': {
    backgroundColor: (theme) =>
      theme.palette.mode === 'dark'
        ? undefined
        : alpha(theme.palette.common.white, 0.92),
  },
  '& .MuiFormControl-root .MuiOutlinedInput-notchedOutline': {
    borderColor: (theme) =>
      theme.palette.mode === 'dark'
        ? undefined
        : alpha(theme.palette.text.primary, 0.2),
  },
};
