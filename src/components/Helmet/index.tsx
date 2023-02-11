import Head from 'next/head';

import { siteDescription, siteName } from '@/const/siteMeta';

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
      content={
        description ? `${siteDescription}${description}` : siteDescription
      }
    />
  </Head>
);
