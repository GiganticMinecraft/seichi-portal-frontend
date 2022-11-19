import { Presenter } from './presenter';

type Props = {
  title?: string;
  description?: string;
  siteName?: string;
};

export const Helmet = ({
  title,
  description = '',
  siteName = 'SeichiForm',
}: Props) => (
  <Presenter
    title={title ? `${title} | ${siteName}` : siteName}
    description={description}
  />
);
