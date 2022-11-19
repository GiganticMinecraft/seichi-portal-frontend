import Head from 'next/head';

type Props = {
  title: string;
  description: string;
};

export const Presenter = ({ title, description }: Props) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
  </Head>
);
