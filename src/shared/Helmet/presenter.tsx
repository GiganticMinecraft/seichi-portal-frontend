import Head from 'next/head';

type Props = {
  title?: string;
  description?: string;
};

const siteName = 'SeichiPortal';

export const Helmet = ({ title, description = '' }: Props) => (
  <Head>
    <title>{title ? `${title} | ${siteName}` : siteName}</title>
    <meta data-testid="meta-desc" name="description" content={description} />
  </Head>
);
