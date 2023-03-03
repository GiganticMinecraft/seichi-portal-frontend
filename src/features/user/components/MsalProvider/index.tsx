import { Presenter, type PresenterProps } from './presenter';

import { msalConfig } from '../../config/msal';

type Props = Omit<PresenterProps, 'config'>;

export const MsalProvider = ({ children }: Props) => (
  <Presenter config={msalConfig}>{children}</Presenter>
);
