import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';

import { FONT_INTER_MEDIUM, FONT_INTER_REGULAR } from 'constants/fonts';
import { UIStyle } from 'views/style';

export const injectFonts = () => {
  if (typeof window === 'undefined') return;

  const styleElement = document.createElement('style');

  styleElement.textContent = `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        src: url(${FONT_INTER_REGULAR}) format('woff2');
      }
      
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        src: url(${FONT_INTER_MEDIUM}) format('woff2');
      }
  `;
  document.head.appendChild(styleElement);
};

injectFonts();

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />

        <meta name="theme-color" content="#2196F3" />

        <title>Wexond - your browser for a new decade</title>
        <meta
          name="description"
          content="Wexond is an innovative browser, changing web experiences for the better."
        />
        <meta
          name="keywords"
          content="Electron Wexond Chrome Chromium macOS Linux Windows React Adblock"
        />

        <link rel="icon" href="favicon.ico" />

        <meta property="og:image" content="https://wexond.net/img/wexond.png" />
        <meta property="og:url" content="https://wexond.net" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@wexond" />
        <meta name="twitter:title" content="Wexond" />
      </Head>
      <UIStyle />
      <Component {...pageProps} />
    </>
  );
};

export default App;
