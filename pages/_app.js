import '../styles/globals.css';
import '../styles/components.css';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Obscura - Secure Vault</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
      </Head>
      <div className="animated-bg-layer animated-bg-mesh" />
      <div className="animated-bg-layer animated-bg-aurora" />
      <Component {...pageProps} />
    </>
  );
}
