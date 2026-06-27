'use client';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton, Tooltip } from '@mui/material';
import { useOptionalThemeMode } from '@/app/_providers/themeMode';

const ThemeModeToggle = () => {
  const themeMode = useOptionalThemeMode();

  if (!themeMode) {
    return null;
  }

  const { mode, toggleMode } = themeMode;

  return (
    <Tooltip
      title={
        mode === 'light' ? 'ダークテーマに切り替え' : 'ライトテーマに切り替え'
      }
    >
      <IconButton
        color="inherit"
        onClick={toggleMode}
        aria-label="toggle theme"
      >
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeModeToggle;
