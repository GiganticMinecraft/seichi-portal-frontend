export const normalizeRedirectTarget = (
  redirectTo: string | null | undefined
) => {
  if (
    !redirectTo ||
    !redirectTo.startsWith('/') ||
    redirectTo.startsWith('//') ||
    // /api/proxy はブラウザが直接表示すべきでない内部APIパスのため、
    // 画面遷移先としては無効。
    redirectTo === '/api/proxy' ||
    redirectTo.startsWith('/api/proxy/')
  ) {
    return '/';
  }

  return redirectTo;
};
