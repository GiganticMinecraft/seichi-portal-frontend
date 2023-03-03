import {
  PublicClientApplication,
  type Configuration,
} from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';

export type PresenterProps = {
  config: Configuration;
  children: React.ReactNode;
};

export const Presenter = ({ config, children }: PresenterProps) => {
  const instance = new PublicClientApplication(config);

  return <MsalProvider instance={instance}>{children}</MsalProvider>;
};
