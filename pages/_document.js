import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon.png" />
        
        {/* Meta Tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Obscura - Secure vault application with end-to-end encryption for storing API keys, passwords, and secure notes" />
        <meta name="keywords" content="password manager, secure vault, encryption, API keys, password storage" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Obscura - Secure Vault" />
        <meta property="og:description" content="End-to-end encrypted vault for your sensitive data" />
        <meta property="og:image" content="/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Obscura - Secure Vault" />
        <meta name="twitter:description" content="End-to-end encrypted vault for your sensitive data" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
