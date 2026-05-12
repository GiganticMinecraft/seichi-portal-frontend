export const normalizeRedirectTarget = (
  redirectTo: string | null | undefined
) => {
  if (
    !redirectTo ||
    !redirectTo.startsWith('/') ||
    redirectTo.startsWith('//')
  ) {
    return '/';
  }

  return redirectTo;
};
