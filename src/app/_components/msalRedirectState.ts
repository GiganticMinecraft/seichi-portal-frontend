'use client';

const hasRedirectResponseHash = () => {
  const hash = window.location.hash;
  return (
    hash.includes('code=') || hash.includes('error=') || hash.includes('state=')
  );
};

export const shouldReloadForMsalRedirectRecovery = () => {
  if (hasRedirectResponseHash()) return false;

  const navigationEntries = window.performance.getEntriesByType('navigation');
  const navigationEntry = navigationEntries[0];

  if (!(navigationEntry instanceof PerformanceNavigationTiming)) return false;

  return navigationEntry.type === 'back_forward';
};
