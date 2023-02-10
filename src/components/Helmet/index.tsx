import Head from 'next/head';

import { siteName, siteDescription } from './defaultValues';

export type HelmetProps = {
  title?: string;
  description?: string;
};

export const Helmet = ({ title, description }: HelmetProps) => (
  <Head>
    <title>{title ? `${title} | ${siteName}` : siteName}</title>
    <meta
      data-testid="meta-desc"
      name="description"
      content={description || siteDescription}
    />
  </Head>
);
