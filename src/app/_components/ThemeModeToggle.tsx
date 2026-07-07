'use client';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton, Tooltip } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

// サーバー描画とハイドレーション時は false、クライアント描画後に true を返す。
// `useColorScheme` の mode/systemMode は effect 前（＝マウント前）で undefined のため、
// マウント判定でアイコンのちらつきとハイドレーション不一致を防ぐ。
const useMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

const ThemeModeToggle = () => {
  const { mode, systemMode, setMode } = useColorScheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <IconButton color="inherit" aria-label="toggle theme" disabled>
        <DarkModeIcon />
      </IconButton>
    );
  }

  const resolvedMode = mode === 'system' ? systemMode : mode;
  const isDark = resolvedMode === 'dark';

  return (
    <Tooltip
      title={isDark ? 'ライトテーマに切り替え' : 'ダークテーマに切り替え'}
    >
      <IconButton
        color="inherit"
        onClick={() => {
          setMode(isDark ? 'light' : 'dark');
        }}
        aria-label="toggle theme"
      >
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeModeToggle;
